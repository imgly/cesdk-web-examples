import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';
import classes from './PhotoUI.module.css';

const PhotoUI = () => {
  const { sceneIsLoaded, editMode } = useEditor();


  return (
    <div
      className={classNames(classes.wrapper, {
        [classes['wrapper--crop']]: editMode === 'Crop'
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
