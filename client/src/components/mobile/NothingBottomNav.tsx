import { Link, useLocation } from 'wouter';
import { GraduationCap, Package, Palette, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';
import { useState } from 'react';

const tabs = [
  { id: 'learn', icon: GraduationCap, label: '학습', path: '/' },
  { id: 'packs', icon: Package, label: '팩', path: '/packs' },
  { id: 'studio', icon: Palette, label: '스튜디오', path: '/studio' },
  { id: 'profile', icon: User, label: '프로필', path: '/profile' },
];

export function NothingBottomNav() {
  const [location, navigate] = useLocation();
  const [activeIndex, setActiveIndex] = useState(() => {
    const currentIndex = tabs.findIndex(tab => tab.path === location);
    return currentIndex >= 0 ? currentIndex : 0;
  });

  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => {
      const nextIndex = Math.min(activeIndex + 1, tabs.length - 1);
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
        navigate(tabs[nextIndex].path);
      }
    },
    onSwipeRight: () => {
      const prevIndex = Math.max(activeIndex - 1, 0);
      if (prevIndex !== activeIndex) {
        setActiveIndex(prevIndex);
        navigate(tabs[prevIndex].path);
      }
    },
  });

  const handleTabClick = (index: number, path: string) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <nav 
      ref={swipeRef}
      className="fixed bottom-0 left-0 right-0 z-50"
      data-testid="bottom-navigation"
    >
      {/* Nothing™ Navigation Bar */}
      <div className="bg-gradient-to-r from-primary-900/98 via-primary-800/98 to-primary-900/98 backdrop-blur-2xl border-t-2 border-accent-purple/30">
        {/* Ambient glow on top */}
        <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent"></div>
        
        <div className="px-6 py-4 relative">
          <div className="flex justify-around items-center">
            {tabs.map((tab, index) => {
              const isActive = location === tab.path;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(index, tab.path)}
                  className={cn(
                    "relative min-w-[70px] h-16 flex flex-col items-center justify-center rounded-2xl transition-all duration-500 transform",
                    "hover:scale-110 active:scale-95",
                    isActive 
                      ? "text-white bg-gradient-to-br from-accent-purple via-accent-blue to-accent-purple shadow-2xl shadow-accent-purple/50 scale-125" 
                      : "text-gray-400 hover:text-accent-purple hover:bg-accent-purple/15"
                  )}
                  data-testid={`nav-${tab.id}`}
                >
                  {/* Active state glow effect */}
                  {isActive && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl opacity-40 blur-xl animate-pulse"></div>
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <Icon 
                      size={isActive ? 28 : 22} 
                      className={cn(
                        "mb-2 transition-all duration-300",
                        isActive ? "drop-shadow-[0_0_12px_white]" : ""
                      )} 
                    />
                    <span className={cn(
                      "text-xs font-bold tracking-wide",
                      isActive ? "text-white drop-shadow-lg" : ""
                    )}>
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-accent-purple to-transparent rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}
