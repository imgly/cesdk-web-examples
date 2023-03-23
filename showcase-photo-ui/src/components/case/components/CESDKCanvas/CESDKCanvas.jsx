import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);

  const { engineIsLoaded, creativeEngine } = useEditor();

  useEffect(() => {
    if (!engineIsLoaded) {
      return;
    }
    const container = wrapperRef.current;
    const canvas = creativeEngine.element;

    container.append(canvas);
    return () => {
      container.remove(canvas);
    };
  }, [engineIsLoaded, creativeEngine]);

  return <div id="cesdk" className={classes.wrapper} ref={wrapperRef}></div>;
};

export default CESDKCanvas;
