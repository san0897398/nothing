import { useState, useEffect, useRef } from 'react';
import { Send, Bot, GraduationCap, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/auth-utils';

interface Message {
  id: number;
  message: string;
  role: 'user' | 'assistant';
  createdAt: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

// MinimalHeader 컴포넌트 (44px)
function MinimalHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg">AI 학습 도우미</h1>
          <p className="text-purple-400 text-xs">온라인</p>
        </div>
      </div>
    </div>
  );
}

// EmptyState 컴포넌트 
function EmptyState({ onQuickStart }: { onQuickStart: (message: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6">
        <GraduationCap className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-center">
        <span className="text-white">AI 학습</span>
        <span className="gradient-text"> 도우미</span>
      </h2>
      
      <p className="text-gray-400 text-center mb-8 max-w-sm">
        궁금한 것이 있으면 언제든 물어보세요!
      </p>
      
      <button 
        onClick={() => onQuickStart("안녕하세요!")}
        className="px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors"
        data-testid="button-quick-start"
      >
        대화 시작하기
      </button>
    </div>
  );
}

// MessageBubble 컴포넌트
function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.type === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] p-4 rounded-2xl ${
        message.type === 'ai' 
          ? 'bg-slate-800 border border-purple-500/20 text-white' 
          : 'bg-purple-500 text-white'
      }`}>
        <p className="leading-relaxed">{message.content}</p>
        <div className="mt-2 text-xs opacity-70">
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}

// MessageList 컴포넌트 
function MessageList({ messages, isLoading }: { messages: Message[], isLoading: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-4 space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="max-w-xs p-4 rounded-2xl bg-slate-800 border border-purple-500/20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

// ChatInput 컴포넌트
function ChatInput({ 
  message, 
  showFileInput, 
  onMessageChange, 
  onKeyDown, 
  onSendMessage, 
  onToggleFileInput,
  disabled 
}: {
  message: string;
  showFileInput: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onToggleFileInput: () => void;
  disabled: boolean;
}) {
  return (
    <div className="p-4 bg-slate-900/95 backdrop-blur-sm border-t border-purple-500/20">
      {/* File Input (토글 방식) */}
      {showFileInput && (
        <div className="mb-3 p-3 bg-slate-800 rounded-xl">
          <input type="file" multiple className="w-full text-white text-sm" />
        </div>
      )}
      
      <div className="flex items-end space-x-3">
        {/* File Button */}
        <button
          onClick={onToggleFileInput}
          className="p-3 bg-slate-800 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          data-testid="button-toggle-file"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={onMessageChange}
            onKeyDown={onKeyDown}
            placeholder="메시지를 입력하세요..."
            className="w-full bg-slate-800 border border-purple-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            style={{ fontSize: '16px' }}
            data-testid="input-message"
          />
          
          <button
            onClick={onSendMessage}
            disabled={!message.trim() || disabled}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${
              message.trim() && !disabled
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            data-testid="button-send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 전체 화면 채팅 컨테이너
export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch chat messages
  const { data: fetchedMessages = [] } = useQuery({
    queryKey: ['/api/chat-messages'],
    enabled: isAuthenticated,
  });

  // Transform messages to our format
  useEffect(() => {
    if (Array.isArray(fetchedMessages)) {
      const transformedMessages: Message[] = fetchedMessages.map((msg: any) => ({
        ...msg,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.message,
        timestamp: msg.createdAt,
      }));
      setMessages(transformedMessages);
    }
  }, [fetchedMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      setIsLoading(true);
      return apiRequest('POST', '/api/chat-messages', { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-messages'] });
      setMessage('');
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Handle quick start
  const handleQuickStart = (quickMessage: string) => {
    setMessage(quickMessage);
    handleSendMessage(quickMessage);
  };

  // Handle send message
  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || message.trim();
    if (textToSend && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(textToSend);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state while authenticating
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center">
          <Bot className="mx-auto mb-4 text-purple-400" size={32} />
          <p className="text-gray-400">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <MinimalHeader />
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onQuickStart={handleQuickStart} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>
      <ChatInput 
        message={message}
        showFileInput={showFileInput}
        onMessageChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSendMessage={handleSendMessage}
        onToggleFileInput={() => setShowFileInput(!showFileInput)}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}