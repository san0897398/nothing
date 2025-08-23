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
      <div className="bg-primary-900/95 backdrop-blur-sm border-t border-accent-purple/20">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            {tabs.map((tab, index) => {
              const isActive = location === tab.path;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(index, tab.path)}
                  className={cn(
                    "min-w-[60px] min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all duration-300",
                    "hover:bg-accent-purple/10 active:scale-95",
                    isActive ? "text-accent-purple" : "text-gray-400"
                  )}
                  data-testid={`nav-${tab.id}`}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      "mb-1 transition-all duration-300",
                      isActive && "drop-shadow-[0_0_8px_var(--accent-purple)]"
                    )} 
                  />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
        </div>
      </div>
    </nav>
  );
}
