import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
// This library prevents touch gestures on mobile like pull-to-refresh on the custom UI
import { disable, enable } from '../../lib/inobounce';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);

  const { engineIsLoaded, creativeEngine } = useEditor();

  useEffect(() => {
    // Disable bouncing only if the canvas is really visible
    if (
      !engineIsLoaded ||
      !wrapperRef ||
      wrapperRef.current.getBoundingClientRect().height <= 0
    ) {
      disable();
    } else {
      enable();
    }

    return () => disable();
  }, [engineIsLoaded, wrapperRef]);

  useEffect(() => {
    if (!engineIsLoaded) {
      return;
    }
    const container = wrapperRef.current;
    const canvas = creativeEngine.element;
    // Workaround until 1.9.0 to let the custom canvas web element stretch to full size
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    canvas.style.position = 'absolute';

    container.append(canvas);
    return () => {
      container.remove(canvas);
    };
  }, [engineIsLoaded, creativeEngine]);

  return <div id="cesdk" className={classes.wrapper} ref={wrapperRef}></div>;
};

export default CESDKCanvas;
