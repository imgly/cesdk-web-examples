import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
// This library prevents touch gestures on mobile like pull-to-refresh on the custom UI
import { disable, enable } from '../../lib/inobounce';
import { CursorStyle } from '../../lib/useGlobalCursorStyle';
import classes from './CESDKCanvas.module.css';

const resizeCanvas = (wrapperNode, canvasNode) => {
  if (!wrapperNode || !canvasNode) return;
  // Make canvas use up no space.
  canvasNode.style.width = '0px';
  canvasNode.style.height = '0px';
  // Get available space of the wrapper
  const { width, height } = wrapperNode.getBoundingClientRect();
  // Set canvas dimensions
  canvasNode.width = width * window.devicePixelRatio;
  canvasNode.height = height * window.devicePixelRatio;
  canvasNode.style.width = `${width}px`;
  canvasNode.style.height = `${height}px`;
  canvasNode.style.display = `block`;
};

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);
  const { setCanvas, canvas, isLoaded, customEngine } = useEditor();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) {
      return;
    }
    const o = new ResizeObserver(([entry]) => {
      resizeCanvas(wrapper, canvas);
      if (isLoaded) {
        customEngine?.zoomToPage();
      }
    });
    o.observe(wrapper);
    return () => o.unobserve(wrapper);
  }, [canvas, wrapperRef, isLoaded, customEngine]);

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
      <canvas id="canvas" ref={setCanvas} className={classes.canvas}></canvas>
      {isLoaded && <CursorStyle wrapperRef={wrapperRef} />}
    </div>
  );
};

export default CESDKCanvas;
