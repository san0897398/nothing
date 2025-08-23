import { useAuth } from '@/hooks/use-auth';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { ChatInterface } from '@/components/mobile/ChatInterface';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          {/* Nothing™ Loading Animation */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-glow opacity-20 animate-ping"></div>
            <div className="relative w-full h-1 bg-primary-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-purple to-accent-blue animate-pulse rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-white">Loading</span>
            <span className="text-transparent bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text"> Experience™</span>
          </h2>
          
          <p className="text-gray-400 text-sm mb-4">
            Nothing™ 시스템 초기화 중...
          </p>
          
          <div className="flex items-center justify-center space-x-1">
            <div className="w-1 h-1 rounded-full bg-accent-purple animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-1 h-1 rounded-full bg-accent-blue animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-1 rounded-full bg-accent-glow animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <MobileLayout>
      <ChatInterface />
    </MobileLayout>
  );
}
