import { useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import classNames from 'classnames';
import classes from './CESDKCanvas.module.css';
import { useEngine } from '../../lib/EngineContext';

const CESDKCanvas = () => {
  const wrapperRef = useRef(null);
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const { sceneIsLoaded } = useEditor();

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

  return (
    <div
      id="cesdk"
      className={classNames(classes.wrapper, {
        // We want the canvas to be created inside the DOM to make it available for the CE.SDK engine.
        // However the canvas should not be visible for the user until the scene is loaded.
        [classes['wrapper--visible']]: sceneIsLoaded
      })}
      ref={wrapperRef}
    ></div>
  );
};

export default CESDKCanvas;
