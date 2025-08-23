import { ReactNode } from 'react';
import { NothingBottomNav } from './NothingBottomNav';
import { AIAssistant } from './AIAssistant';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 mobile-layout relative overflow-hidden">
      {/* Nothing™ ambient background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      <main className="pb-20 flex-1 flex flex-col min-h-0 relative z-10">
        {children}
      </main>
      <AIAssistant />
      <NothingBottomNav />
    </div>
  );
}
