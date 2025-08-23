import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  isTouchDevice: boolean;
  userAgent: string;
}

export function useMobileDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1024,
        isTouchDevice: false,
        userAgent: '',
      };
    }

    const width = window.innerWidth;
    const userAgent = navigator.userAgent;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return {
      isMobile: width <= 767 && isTouchDevice,
      isTablet: width >= 768 && width <= 1023 && isTouchDevice,
      isDesktop: width >= 1024 || !isTouchDevice,
      screenWidth: width,
      isTouchDevice,
      userAgent,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setDeviceInfo({
        isMobile: width <= 767 && isTouchDevice,
        isTablet: width >= 768 && width <= 1023 && isTouchDevice,
        isDesktop: width >= 1024 || !isTouchDevice,
        screenWidth: width,
        isTouchDevice,
        userAgent,
      });
    };

    const handleOrientationChange = () => {
      // Delay to allow for orientation change to complete
      setTimeout(handleResize, 500);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}
