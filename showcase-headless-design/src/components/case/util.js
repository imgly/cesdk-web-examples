import { useEffect, useState } from 'react';

export const caseAssetPath = (path, caseId = 'headless-design') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

export function getDevicePixelRatio() {
  return typeof devicePixelRatio === 'number' ? devicePixelRatio : 1;
}

export function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(getDevicePixelRatio());

  useEffect(() => {
    const mediaQuery = matchMedia(`(resolution: ${dpr}dppx)`);
    const handleDPRChange = () => setDpr(getDevicePixelRatio());
    handleDPRChange();
    mediaQuery.addEventListener('change', handleDPRChange, false);
    return () =>
      mediaQuery.removeEventListener('change', handleDPRChange, false);
  }, [dpr]);

  return [dpr, setDpr];
}
