import { useEffect } from 'react';

export const useOnClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    // Use isTrusted to check if the event is coming from a real user, or is coming from a script.
    if (ref.current && !ref.current.contains(e.target) && e.isTrusted) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
