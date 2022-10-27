import { useCallback, useEffect, useState } from 'react';

export const caseAssetPath = (path, caseId = 'photo-ui') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

export const useTimeout = (func, delay = 400) => {
  const [recenterTime, setRecenterTime] = useState(null);
  const resetTimer = useCallback(() => {
    setRecenterTime(Date.now() + delay);
  }, [delay]);
  useEffect(() => {
    if (!recenterTime) {
      return;
    }
    const waitTimeMS = recenterTime - Date.now();
    let timeout = setTimeout(func, waitTimeMS);
    return () => {
      clearTimeout(timeout);
    };
  }, [func, recenterTime]);
  return {
    resetTimer
  };
};
