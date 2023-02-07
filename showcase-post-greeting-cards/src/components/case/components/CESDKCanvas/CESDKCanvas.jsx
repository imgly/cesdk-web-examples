import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classNames from 'classnames';
import classes from './CESDKCanvas.module.css';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);

  const { sceneIsLoaded, engineIsLoaded, currentStep, creativeEngine } =
    useEditor();

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
