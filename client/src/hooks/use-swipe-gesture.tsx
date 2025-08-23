import { useEffect, useRef } from 'react';

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipeGesture(callbacks: SwipeCallbacks) {
  const elementRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const { threshold = 50 } = callbacks;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onTouchStart = (e: TouchEvent) => {
      touchEndRef.current = null;
      touchStartRef.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      touchEndRef.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const onTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const distanceX = touchStartRef.current.x - touchEndRef.current.x;
      const distanceY = touchStartRef.current.y - touchEndRef.current.y;
      const isLeftSwipe = distanceX > threshold;
      const isRightSwipe = distanceX < -threshold;
      const isUpSwipe = distanceY > threshold;
      const isDownSwipe = distanceY < -threshold;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (isLeftSwipe && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft();
        }
        if (isRightSwipe && callbacks.onSwipeRight) {
          callbacks.onSwipeRight();
        }
      } else {
        if (isUpSwipe && callbacks.onSwipeUp) {
          callbacks.onSwipeUp();
        }
        if (isDownSwipe && callbacks.onSwipeDown) {
          callbacks.onSwipeDown();
        }
      }
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [callbacks, threshold]);

  return elementRef;
}
