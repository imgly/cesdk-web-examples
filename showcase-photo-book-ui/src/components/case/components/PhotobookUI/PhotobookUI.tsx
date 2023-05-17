import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import { useEngine } from '../../lib/EngineContext';
import BookPreviewBar from '../BookPreviewBar/BookPreviewBar';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';
import classes from './PhotobookUI.module.css';

const PhotobookUI = () => {
  const { isLoaded: engineIsLoaded } = useEngine();
  const { sceneIsLoaded } = useEditor();

  return (
    <div className={classes.wrapper}>
      <BookPreviewBar />
      <div className={classes.contentWrapper}>
        {!sceneIsLoaded && <LoadingSpinner />}
        {sceneIsLoaded && <TopBar />}
        {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
        <CESDKCanvas key="canvas" />
        {/* We want hide the bottom controls in the last step */}
        {engineIsLoaded && <BottomControls visible={sceneIsLoaded} />}
      </div>
    </div>
  );
};

export default PhotobookUI;
