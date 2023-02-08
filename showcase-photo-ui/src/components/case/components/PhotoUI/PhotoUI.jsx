import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';
import classes from './PhotoUI.module.css';

const PhotoUI = () => {
  const { sceneIsLoaded, creativeEngine, editMode, refocus, setCanRecenter } =
    useEditor();

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const DRAGGING_CURSORS = ['Resize', 'Move'];
    if (!sceneIsLoaded || editMode !== 'Crop') {
      return;
    }
    let previousTimeout;
    const onMouseUp = (e) => {
      if (e.target !== creativeEngine.element) {
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
        e.target === creativeEngine.element &&
        DRAGGING_CURSORS.includes(creativeEngine.editor.getCursorType())
      ) {
        setIsDragging(true);
      }
    };
    creativeEngine.element.addEventListener('mousedown', onMouseDown);
    creativeEngine.element.addEventListener('touchstart', onMouseDown);

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('touchcancel', onMouseUp);
    return () => {
      creativeEngine.element.removeEventListener('mousedown', onMouseDown);
      creativeEngine.element.removeEventListener('touchstart', onMouseDown);

      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchcancel', onMouseUp);
    };
  }, [creativeEngine, editMode, refocus, sceneIsLoaded, setCanRecenter]);


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
