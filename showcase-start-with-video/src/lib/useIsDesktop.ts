import { useState, useEffect } from 'react';
import { useHasMounted } from './useHasMounted';

const DESKTOP_WIDTH = 650;
const SSR_DESKTOP_WIDTH = 1024;

const detectDesktop = () =>
  (isSSR ? SSR_DESKTOP_WIDTH : window.innerWidth) > DESKTOP_WIDTH;
export const useIsDesktop = () => {
  const [isDesktop, setDesktop] = useState(true);
  const hasMounted = useHasMounted();
  const updateMedia = () => {
    setDesktop(detectDesktop());
  };
  useEffect(() => {
    if (!hasMounted) return;

    updateMedia();
  }, [hasMounted]);

  useEffect(() => {
    if (isSSR) return;

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  return { isDesktop };
};

export const isSSR = typeof window === 'undefined';
