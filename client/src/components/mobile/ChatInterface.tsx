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
    <div className="flex items-center justify-between px-4 py-3 glassmorphism border-b border-subtle">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center" style={{
          background: `linear-gradient(135deg, var(--accent-purple), var(--accent-blue))`
        }}>
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg">AI 학습 도우미</h1>
          <p className="text-xs" style={{ color: 'var(--accent-glow)' }}>지식을 업로드 중...</p>
        </div>
      </div>
    </div>
  );
}

// EmptyState 컴포넌트 
function EmptyState({ onQuickStart }: { onQuickStart: (message: string) => void }) {
  const [loadingText, setLoadingText] = useState('지식 데이터베이스 로딩 중...');
  
  useEffect(() => {
    const messages = [
      '지식 데이터베이스 로딩 중...',
      '뇌파 동조화 완료',
      '학습 모드 활성화',
      '지식을 전송할 준비 완료'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center" style={{
        background: `linear-gradient(135deg, var(--accent-purple), var(--accent-blue))`,
        boxShadow: `0 0 40px var(--nothing-glow)`
      }}>
        <GraduationCap className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 text-center leading-tight">
        <span className="text-white">Absolutely</span>
        <br />
        <span className="text-transparent bg-gradient-to-r from-accent-purple via-accent-blue to-accent-glow bg-clip-text"> Nothing™</span>
      </h2>
      
      <p className="text-xs mb-2" style={{ color: 'var(--accent-glow)' }}>
        {loadingText}
      </p>
      
      <p className="text-gray-300 text-center mb-8 max-w-lg text-lg opacity-90 leading-relaxed">
        Experience the profound power of AI-assisted learning.
        <br />
        <span className="text-accent-glow text-sm">깊이 있는 지식을 전송할 준비가 완료되었습니다.</span>
      </p>
      
      <button 
        onClick={() => onQuickStart("안녕하세요!")}
        className="px-6 py-3 text-white rounded-2xl font-medium transition-colors duration-200 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90"
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
    <div className={`flex ${message.type === 'ai' ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 ${
        message.type === 'ai' 
          ? 'bg-gradient-to-br from-primary-800 to-primary-700 border border-accent-purple/20 text-white' 
          : 'bg-gradient-to-br from-accent-purple to-accent-blue text-white shadow-lg shadow-accent-purple/20'
      }`}>
        <p className="leading-relaxed text-sm">{message.content}</p>
        <div className="mt-3 text-xs opacity-60 flex items-center justify-between">
          <span>
            {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit', minute: '2-digit'
            })}
          </span>
          {message.type === 'ai' && (
            <span className="text-accent-glow text-xs">
              Nothing™ AI
            </span>
          )}
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
          <div className="max-w-xs p-4 rounded-2xl chat-bubble-ai shimmer-border gradient-glow active">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-pulse pulse-glow" style={{ 
                  backgroundColor: 'var(--accent-purple)', 
                  animationDelay: '0s' 
                }}></div>
                <div className="w-2 h-2 rounded-full animate-pulse pulse-glow" style={{ 
                  backgroundColor: 'var(--accent-blue)', 
                  animationDelay: '0.2s' 
                }}></div>
                <div className="w-2 h-2 rounded-full animate-pulse pulse-glow" style={{ 
                  backgroundColor: 'var(--accent-glow)', 
                  animationDelay: '0.4s' 
                }}></div>
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--accent-glow)' }}>
              뇌파 분석 중... (Nothing™이 깊게 사고하는 중)
            </p>
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
  onMessageChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSendMessage: () => void;
  onToggleFileInput: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="p-4 bg-primary-900/95 backdrop-blur-sm border-t border-accent-purple/20 mobile-safe-area">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleFileInput}
          className={`p-3 rounded-full transition-colors duration-200 ${
            showFileInput
              ? 'bg-accent-purple text-white'
              : 'bg-primary-700 text-gray-400 hover:bg-primary-600'
          }`}
          data-testid="button-file-input"
        >
          <Plus size={20} />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="메시지를 입력하세요..."
            className="w-full p-4 pr-14 bg-primary-800 text-white placeholder-gray-400 rounded-2xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 resize-none mobile-text-base"
            style={{ fontSize: '16px' }}
            rows={1}
            disabled={disabled}
            data-testid="input-message"
          />
          
          <button
            onClick={onSendMessage}
            disabled={disabled || !message.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-accent-purple text-white rounded-full hover:bg-accent-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-testid="button-send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main ChatInterface Component
export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [showFileInput, setShowFileInput] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Fetch existing messages
  const { data: fetchedMessages, isLoading: messagesLoading } = useQuery({
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
      return apiRequest('POST', '/api/chat-messages', { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-messages'] });
      setMessage('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "로그인 필요",
          description: "채팅을 사용하려면 로그인해주세요.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "오류 발생",
        description: "메시지 전송에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickStart = (quickMessage: string) => {
    setMessage(quickMessage);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <MinimalHeader />
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !messagesLoading ? (
          <EmptyState onQuickStart={handleQuickStart} />
        ) : (
          <MessageList 
            messages={messages} 
            isLoading={sendMessageMutation.isPending}
          />
        )}
      </div>
      
      {/* Input */}
      <ChatInput
        message={message}
        showFileInput={showFileInput}
        onMessageChange={setMessage}
        onKeyDown={handleKeyDown}
        onSendMessage={handleSendMessage}
        onToggleFileInput={() => setShowFileInput(!showFileInput)}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}