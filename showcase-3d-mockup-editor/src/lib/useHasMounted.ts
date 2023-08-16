import { useEffect, useState } from 'react';

// This is used to prevent rehydration errors with dynamic content
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
};
