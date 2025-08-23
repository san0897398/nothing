import { useState, useEffect } from 'react';

export function useAnimationPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange(); // Set initial value
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    prefersReducedMotion,
    animationDuration: prefersReducedMotion ? '0s' : undefined,
    animationClass: prefersReducedMotion ? 'animate-none' : '',
  };
}
