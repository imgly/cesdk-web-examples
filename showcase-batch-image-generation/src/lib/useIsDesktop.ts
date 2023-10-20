import { useState, useEffect } from 'react';

const DESKTOP_WIDTH = 650;
const detectDesktop = () => window.innerWidth > DESKTOP_WIDTH;
export const useIsDesktop = () => {
  const [isDesktop, setDesktop] = useState(detectDesktop());
  const updateMedia = () => {
    setDesktop(detectDesktop());
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  return { isDesktop };
};
