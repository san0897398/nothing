import { useAnimationPreference } from '@/hooks/use-animation-preference';
import { cn } from '@/lib/utils';

interface LearningProgressBarProps {
  progress: number; // 0-100
  isLoading?: boolean;
  subtitle?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LearningProgressBar({
  progress,
  isLoading,
  subtitle = "뇌에 업로드 중...",
  showPercentage = true,
  size = 'md',
}: LearningProgressBarProps) {
  const { prefersReducedMotion } = useAnimationPreference();
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full space-y-2" data-testid="progress-bar">
      <div className={cn(
        "relative w-full bg-primary-700 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            "h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-success rounded-full transition-all duration-500 ease-out",
            !prefersReducedMotion && "animate-pulse"
          )}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
        {isLoading && !prefersReducedMotion && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </div>
      
      {(subtitle || showPercentage) && (
        <div className="flex justify-between items-center">
          {subtitle && (
            <span className="text-xs text-accent-purple font-medium">
              {subtitle}
            </span>
          )}
          {showPercentage && (
            <span className="text-xs text-white">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
