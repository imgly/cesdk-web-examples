import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
// This library prevents touch gestures on mobile like pull-to-refresh on the custom UI
import classNames from 'classnames';
import { disable, enable } from '../../lib/inobounce';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);

  const { sceneIsLoaded, engineIsLoaded, currentStep, creativeEngine } =
    useEditor();

  useEffect(() => {
    // Disable bouncing only if the canvas is really visible
    if (
      !sceneIsLoaded ||
      !wrapperRef ||
      wrapperRef.current.getBoundingClientRect().height <= 0
    ) {
      disable();
    } else {
      enable();
    }

    return () => disable();
  }, [sceneIsLoaded, wrapperRef]);

  useEffect(() => {
    if (!engineIsLoaded) {
      return;
    }
    const container = wrapperRef.current;
    const canvas = creativeEngine.element;
    // Workaround until 1.8.0 to let the custom canvas web element stretch to full size
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    canvas.style.position = 'absolute';

    container.append(canvas);
    return () => {
      container.remove(canvas);
    };
  }, [engineIsLoaded, creativeEngine]);

  return (
    <div
      id="cesdk"
      className={classNames(classes.wrapper, {
        // The canvas should not take up any space in the "Style" step
        [classes['wrapper--hidden']]: currentStep === 'Style',
        // We want the canvas to be created inside the DOM to make it available for the CE.SDK engine.
        // However the canvas should not be visible for the user until the scene is loaded.
        [classes['wrapper--visible']]: sceneIsLoaded
      })}
      ref={wrapperRef}
    ></div>
  );
};

export default CESDKCanvas;
