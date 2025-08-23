import { ReactNode } from 'react';
import { NothingBottomNav } from './NothingBottomNav';
import { AIAssistant } from './AIAssistant';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-primary-900 mobile-layout">
      <main className="pb-20 flex-1 flex flex-col min-h-0">
        {children}
      </main>
      <AIAssistant />
      <NothingBottomNav />
    </div>
  );
}
