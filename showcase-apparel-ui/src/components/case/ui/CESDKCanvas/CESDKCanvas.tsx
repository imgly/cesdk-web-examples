import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useEngine } from '../../lib/EngineContext';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = ({ isVisible }: { isVisible: boolean }) => {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const { engine, isLoaded } = useEngine();

  useEffect(() => {
    const container = wrapperRef.current;
    const canvas = engine?.element;
    if (!isLoaded || !canvas || container === null) {
      return;
    }
    container.append(canvas);
    return () => {
      container.removeChild(canvas);
    };
  }, [isLoaded, engine]);

  return (
    <div
      id="cesdk"
      className={classes.wrapper}
      style={{
        visibility: isVisible ? 'visible' : 'hidden'
      }}
      ref={wrapperRef}
    ></div>
  );
};

export default CESDKCanvas;
