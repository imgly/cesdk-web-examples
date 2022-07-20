import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
// This library prevents touch gestures on mobile like pull-to-refresh on the custom UI
import { disable, enable } from '../../lib/inobounce';
import { CursorStyle } from '../../lib/useGlobalCursorStyle';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);
  const { viewMode, setCanvas, canvas, isLoaded } = useEditor();

  useEffect(() => {
    if (!canvas || !wrapperRef) {
      return;
    }
    const o = new ResizeObserver(([entry]) => {
      if (!wrapperRef.current) return;
      const { width, height } = wrapperRef.current.getBoundingClientRect();
      entry.target.width = width * window.devicePixelRatio;
      entry.target.height = height * window.devicePixelRatio;
    });
    o.observe(canvas);
  }, [canvas, wrapperRef]);

  useEffect(() => {
    // Disable bouncing only if the canvas is really visible
    if (
      !canvas ||
      !wrapperRef ||
      wrapperRef.current.getBoundingClientRect().height <= 0
    ) {
      disable();
    } else {
      enable();
    }

    return () => disable();
  }, [canvas, wrapperRef]);

  return (
    <div id="cesdk" className={classes.wrapper} ref={wrapperRef}>
      {/* Workaround to disable interaction on the canvas */}
      {viewMode === 'preview' && <div className={classes.previewBlocker}></div>}
      <canvas id="canvas" ref={setCanvas} className={classes.canvas}></canvas>
      {isLoaded && <CursorStyle wrapperRef={wrapperRef} />}
    </div>
  );
};

export default CESDKCanvas;
