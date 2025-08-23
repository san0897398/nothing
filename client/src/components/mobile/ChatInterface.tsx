import { useState, useEffect, useRef } from 'react';
import { Send, Upload, Save, Download, MoreVertical, Bot, User } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ObjectUploader } from '@/components/ObjectUploader';
import { cn } from '@/lib/utils';
import { isUnauthorizedError } from '@/lib/auth-utils';
import type { UploadResult } from '@uppy/core';

interface ChatMessage {
  id: number;
  message: string;
  role: 'user' | 'assistant';
  createdAt: string;
  metadata?: {
    suggestions?: string[];
    actions?: Array<{
      type: 'upload' | 'save' | 'export' | 'navigate';
      label: string;
      data?: any;
    }>;
  };
}

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Fetch chat messages
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/chat-messages'],
    enabled: isAuthenticated,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return apiRequest('POST', '/api/chat-messages', { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-messages'] });
      setMessage('');
      setIsThinking(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    onError: (error) => {
      setIsThinking(false);
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

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sendMessageMutation.isPending) return;

    setIsThinking(true);
    sendMessageMutation.mutate(trimmedMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    try {
      if (result.successful.length > 0) {
        const file = result.successful[0];
        await apiRequest('PUT', '/api/file-uploads', {
          uploadURL: file.uploadURL,
          filename: file.name,
          originalName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
        
        toast({
          title: "파일 업로드 성공",
          description: `${file.name}이(가) 성공적으로 업로드되었습니다.`,
        });

        queryClient.invalidateQueries({ queryKey: ['/api/chat-messages'] });
      }
    } catch (error) {
      console.error('Upload completion error:', error);
      toast({
        title: "업로드 오류",
        description: "파일 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProgress = () => {
    // TODO: Implement save progress logic
    toast({
      title: "진도 저장됨",
      description: "현재 학습 진도가 저장되었습니다.",
    });
  };

  const handleExportResults = () => {
    // TODO: Implement export logic
    toast({
      title: "결과 내보내기",
      description: "학습 결과를 내보내는 중...",
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isAuthenticated) {
    return (
      <div className="nothing-card rounded-2xl p-6 text-center">
        <p className="text-gray-400 mb-4">채팅을 사용하려면 로그인이 필요합니다.</p>
        <button 
          onClick={() => window.location.href = '/api/login'}
          className="px-4 py-2 bg-accent-purple text-white rounded-lg"
        >
          로그인
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-4">
      <div className="nothing-card rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0" data-testid="chat-interface">
        {/* Chat Header */}
        <div className="p-4 border-b border-accent-purple/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI 학습 도우미</h3>
              <p className="text-gray-400 text-xs">온라인 • 즉시 응답</p>
            </div>
            <div className="ml-auto">
              <button className="w-8 h-8 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center hover:bg-accent-purple/30 transition-colors">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Bot className="mx-auto mb-4" size={32} />
              <p>안녕하세요! 궁금한 것이 있으면 언제든 물어보세요.</p>
            </div>
          ) : (
            messages.map((msg: ChatMessage) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          
          {/* AI Thinking Indicator */}
          {isThinking && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="chat-bubble-ai p-3 rounded-2xl rounded-tl-md">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <span className="text-gray-400 text-xs ml-2">답변을 준비중...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input with Actions */}
        <div className="p-4 border-t border-accent-purple/20 flex-shrink-0">
          {/* Action Buttons */}
          <div className="flex space-x-2 mb-4">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760} // 10MB
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="flex-1 py-2 px-3 bg-accent-blue/20 text-accent-blue rounded-lg text-xs font-medium hover:bg-accent-blue/30 transition-colors"
            >
              <Upload size={14} className="mr-1" />
              파일 업로드
            </ObjectUploader>
            
            <button 
              onClick={handleSaveProgress}
              className="flex-1 py-2 px-3 bg-accent-success/20 text-accent-success rounded-lg text-xs font-medium hover:bg-accent-success/30 transition-colors"
              data-testid="button-save-progress"
            >
              <Save size={14} className="mr-1" />
              진도 저장
            </button>
            
            <button 
              onClick={handleExportResults}
              className="flex-1 py-2 px-3 bg-accent-warning/20 text-accent-warning rounded-lg text-xs font-medium hover:bg-accent-warning/30 transition-colors"
              data-testid="button-export-results"
            >
              <Download size={14} className="mr-1" />
              결과 내보내기
            </button>
          </div>

          {/* Message Input */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea 
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base"
                rows={1}
                style={{ fontSize: '16px', minHeight: '44px' }}
                data-testid="input-message"
              />
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className={cn(
                "floating-action w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
                (!message.trim() || sendMessageMutation.isPending) && "opacity-50 cursor-not-allowed"
              )}
              data-testid="button-send"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: ChatMessage }) {
  const isAI = message.role === 'assistant';
  
  return (
    <div className={cn(
      "flex items-start space-x-3",
      !isAI && "flex-row-reverse space-x-reverse"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isAI 
          ? "bg-gradient-to-br from-accent-purple to-accent-blue"
          : "bg-accent-purple"
      )}>
        {isAI ? (
          <Bot size={14} className="text-white" />
        ) : (
          <User size={14} className="text-white" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] p-3 rounded-2xl",
        isAI 
          ? "chat-bubble-ai rounded-tl-md" 
          : "chat-bubble-user rounded-tr-md"
      )}>
        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>
        
        {isAI && message.metadata?.actions && message.metadata.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.metadata.actions.map((action, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded-lg hover:bg-accent-purple/30 transition-colors"
                data-testid={`action-${action.type}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
