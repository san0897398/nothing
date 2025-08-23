import { Brain } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function AIAssistant() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-40">
      <div 
        className="glassmorphism rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
        data-testid="ai-assistant-button"
      >
        <Brain className="text-accent-purple" size={20} />
      </div>
    </div>
  );
}
