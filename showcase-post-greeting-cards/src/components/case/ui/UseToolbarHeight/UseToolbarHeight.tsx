import { useState, useRef, useEffect } from 'react';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';

const PADDING = 12;

export const useToolbarHeight = () => {
  const { setPaddingBottom, defaultPaddingBottom } = useSinglePageMode();
  const [height, setHeight] = useState<number>(72);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      if (!ref.current) {
        return;
      }
      setHeight(ref.current.getBoundingClientRect().height);
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  useEffect(() => {
    setPaddingBottom(defaultPaddingBottom + height + PADDING);
    return () => {
      setPaddingBottom(defaultPaddingBottom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return {
    ref
  };
};
