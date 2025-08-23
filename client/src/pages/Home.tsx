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
          <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">경험을 로딩 중...</p>
          <p className="text-gray-400 text-sm">잠시만 기다려주세요</p>
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
