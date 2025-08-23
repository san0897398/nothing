import { ReactNode } from 'react';
import { NothingBottomNav } from './NothingBottomNav';
import { AIAssistant } from './AIAssistant';
import { useMobileDetect } from '@/hooks/use-mobile-detect';
import { useAnimationPreference } from '@/hooks/use-animation-preference';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { isMobile } = useMobileDetect();
  const { animationDuration } = useAnimationPreference();

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Desktop Version</h1>
          <p className="text-gray-400">
            This app is optimized for mobile devices. Please use a mobile device or resize your browser window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-primary-900 relative overflow-x-hidden"
      style={{ 
        '--animation-duration': animationDuration,
      } as React.CSSProperties}
    >
      {/* Status Bar Overlay */}
      <div className="h-12 bg-gradient-to-r from-primary-900 to-primary-800 relative z-50">
        <div className="flex justify-between items-center px-4 h-full">
          <div className="text-xs text-gray-400">
            {new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: false
            })}
          </div>
          <div className="flex space-x-1">
            <div className="w-4 h-2 bg-white rounded-sm opacity-80"></div>
            <div className="w-1 h-2 bg-white rounded-sm opacity-60"></div>
            <div className="w-6 h-2 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-24 mobile-safe-area">
        {children}
      </main>

      {/* AI Assistant (Top-right Corner) */}
      <AIAssistant />

      {/* Bottom Navigation */}
      <NothingBottomNav />
    </div>
  );
}
