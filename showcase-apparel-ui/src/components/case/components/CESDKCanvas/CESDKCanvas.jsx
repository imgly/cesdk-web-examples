import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
// This library prevents touch gestures on mobile like pull-to-refresh on the custom UI
import { disable, enable } from '../../lib/inobounce';
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
  const { setCanvas, canvas, isLoaded } = useEditor();

  useEffect(() => {
    if (!canvas || !wrapperRef) {
      return;
    }
    const o = new ResizeObserver(([entry]) => {
      resizeCanvas(wrapperRef.current, canvas);
    });
    o.observe(wrapperRef.current);
  }, [canvas, wrapperRef, isLoaded]);

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
      <canvas id="canvas" ref={setCanvas} className={classes.canvas}></canvas>
    </div>
  );
};

export default CESDKCanvas;
