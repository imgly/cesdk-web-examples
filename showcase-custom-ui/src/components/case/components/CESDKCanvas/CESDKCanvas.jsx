import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);
  const { viewMode, setCanvas, canvas } = useEditor();

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

  return (
    <div id="cesdk" className={classes.wrapper} ref={wrapperRef}>
      {/* Workaround to disable interaction on the canvas */}
      {viewMode === 'preview' && <div className={classes.previewBlocker}></div>}
      <canvas id="canvas" ref={setCanvas} className={classes.canvas}></canvas>
    </div>
  );
};

export default CESDKCanvas;
