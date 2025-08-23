import { ReactNode } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NothingCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  onTap?: () => void;
  children?: ReactNode;
  className?: string;
}

export function NothingCard({
  title,
  subtitle,
  icon,
  isActive,
  isLoading,
  onTap,
  children,
  className,
}: NothingCardProps) {
  return (
    <div 
      onClick={onTap}
      className={cn(
        "relative p-6 rounded-2xl border border-accent-purple/20",
        "bg-gradient-to-br from-primary-800 to-primary-700",
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-purple/20",
        "min-h-[60px] active:scale-[0.98]",
        onTap && "cursor-pointer",
        isActive && "ring-2 ring-accent-purple shadow-lg shadow-accent-purple/30",
        className
      )}
      data-testid="nothing-card"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-4 right-4">
          <Loader2 className="w-6 h-6 text-accent-purple animate-spin" />
        </div>
      )}
      
      {/* Card Content */}
      <div className="flex items-center space-x-4">
        {icon && (
          <div className="text-accent-purple text-2xl flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {onTap && (
          <div className="text-accent-purple opacity-60">
            <ChevronRight size={20} />
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
      
      {/* Glow Effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 to-transparent rounded-2xl pointer-events-none" />
      )}
    </div>
  );
}
