import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);

  const { engineIsLoaded, engine } = useEditor();

  useEffect(() => {
    if (!engineIsLoaded) {
      return;
    }
    const container = wrapperRef.current;
    const canvas = engine.element;
    container.append(canvas);
    return () => {
      container.remove(canvas);
    };
  }, [engineIsLoaded, engine]);

  return <div id="cesdk" className={classes.wrapper} ref={wrapperRef}></div>;
};

export default CESDKCanvas;
