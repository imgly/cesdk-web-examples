import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';
import classes from './PhotoUI.module.css';

const PhotoUI = () => {
  const { sceneIsLoaded, engine, editMode, refocus, setCanRecenter } =
    useEditor();

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const DRAGGING_CURSORS = ['Resize', 'Move'];
    if (!sceneIsLoaded || editMode !== 'Crop') {
      return;
    }
    let previousTimeout;
    const onMouseUp = (e) => {
      if (e.target !== engine.element) {
        return;
      }
      setCanRecenter(true);
      setIsDragging(false);
      if (previousTimeout) {
        clearTimeout(previousTimeout);
      }
      const newTimeout = setTimeout(() => {
        refocus();
      }, 400);
      previousTimeout = newTimeout;
    };

    const onMouseDown = (e) => {
      if (
        e.target === engine.element &&
        DRAGGING_CURSORS.includes(engine.editor.getCursorType())
      ) {
        setIsDragging(true);
      }
    };
    engine.element.addEventListener('mousedown', onMouseDown);
    engine.element.addEventListener('touchstart', onMouseDown);

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('touchcancel', onMouseUp);
    return () => {
      engine.element?.removeEventListener('mousedown', onMouseDown);
      engine.element?.removeEventListener('touchstart', onMouseDown);

      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchcancel', onMouseUp);
    };
  }, [engine, editMode, refocus, sceneIsLoaded, setCanRecenter]);

  return (
    <div
      className={classNames(classes.wrapper, {
        [classes['wrapper--crop']]: editMode === 'Crop',
        [classes['wrapper--in-resize']]: isDragging
      })}
    >
      {!sceneIsLoaded && <LoadingSpinner />}
      {sceneIsLoaded && <TopBar />}
      <CESDKCanvas />
      {sceneIsLoaded && <BottomControls />}
    </div>
  );
};

export default PhotoUI;
