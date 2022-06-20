import { useEffect, useState } from 'react';
import { Source } from '.';

function useStream<T>(stream: Source<T>, defaultValue: T | (() => T)): T;
function useStream<T>(
  stream: Source<T>,
  defaultValue?: T | (() => T)
): T | undefined {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    return stream((e) => {
      setState(e);
    });
  }, [stream]);

  return state;
}

export default useStream;
