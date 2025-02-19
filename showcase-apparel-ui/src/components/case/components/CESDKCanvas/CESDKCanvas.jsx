import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classes from './CESDKCanvas.module.css';

const resizeCanvas = (wrapperNode, canvasNode) => {
  if (!wrapperNode || !canvasNode) return;
  const { width, height } = wrapperNode.getBoundingClientRect();
  canvasNode.width = width * window.devicePixelRatio;
  canvasNode.height = height * window.devicePixelRatio;
  canvasNode.style.width = `${width}px`;
  canvasNode.style.height = `${height}px`;
  canvasNode.style.display = `block`;
};

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);
  const { setCanvas, canvas, viewMode, isLoaded } = useEditor();

  useEffect(() => {
    if (!canvas || !wrapperRef) {
      return;
    }
    const o = new ResizeObserver(([entry]) => {
      resizeCanvas(wrapperRef.current, canvas);
    });
    o.observe(wrapperRef.current);
  }, [canvas, wrapperRef, isLoaded]);

  return (
    <div id="cesdk" className={classes.wrapper} ref={wrapperRef}>
      {viewMode === 'preview' && <div className={classes.previewBlocker}></div>}
      {/* Workaround to disable interaction on the canvas */}
      <canvas id="canvas" ref={setCanvas} className={classes.canvas}></canvas>
    </div>
  );
};

export default CESDKCanvas;
