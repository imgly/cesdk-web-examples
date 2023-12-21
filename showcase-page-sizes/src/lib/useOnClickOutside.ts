import React from 'react';

const useOnClickOutside = (ref: any, callback: any) => {
  const handleClick = (e: any) => {
    // Use isTrusted to check if the event is coming from a real user, or is coming from a script.
    if (ref.current && !ref.current.contains(e.target) && e.isTrusted) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export default useOnClickOutside;
