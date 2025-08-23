import { useState } from 'react';
import { Brain, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: recommendations } = useQuery({
    queryKey: ['/api/recommendations'],
    enabled: isAuthenticated && isExpanded,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-40">
      {/* Main Assistant Button */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "glassmorphism rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300",
          "hover:scale-105 active:scale-95",
          isExpanded && "bg-accent-purple/20"
        )}
        data-testid="ai-assistant-button"
      >
        {isExpanded ? (
          <X className="text-accent-purple" size={20} />
        ) : (
          <Brain className="text-accent-purple" size={20} />
        )}
      </div>

      {/* Expanded Suggestion Panel */}
      {isExpanded && (
        <div className="absolute top-14 right-0 w-72 glassmorphism rounded-xl p-4 text-sm text-gray-300 animate-in slide-in-from-right duration-300">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="text-accent-purple" size={16} />
              <span className="text-white font-medium">AI 추천</span>
            </div>

            {recommendations?.aiRecommendations?.length > 0 ? (
              <div className="space-y-2">
                {recommendations.aiRecommendations.slice(0, 2).map((rec: any, index: number) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-primary-800/50 border border-accent-purple/10 hover:border-accent-purple/30 transition-colors cursor-pointer"
                    data-testid={`ai-recommendation-${index}`}
                  >
                    <p className="text-white text-xs font-medium mb-1">{rec.title}</p>
                    <p className="text-gray-400 text-xs line-clamp-2">{rec.reason}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-accent-purple text-xs">추천</span>
                      <span className="text-gray-500 text-xs">{Math.round(rec.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Brain className="mx-auto mb-2 text-gray-500" size={24} />
                <p className="text-gray-400 text-xs">
                  학습 활동을 시작하면 맞춤 추천을 받을 수 있어요!
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-accent-purple/20 pt-3 mt-3">
              <p className="text-gray-400 text-xs mb-2">빠른 작업</p>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 px-3 bg-accent-blue/20 text-accent-blue rounded-lg text-xs hover:bg-accent-blue/30 transition-colors">
                  학습 계속하기
                </button>
                <button className="flex-1 py-2 px-3 bg-accent-purple/20 text-accent-purple rounded-lg text-xs hover:bg-accent-purple/30 transition-colors">
                  새 팩 찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
