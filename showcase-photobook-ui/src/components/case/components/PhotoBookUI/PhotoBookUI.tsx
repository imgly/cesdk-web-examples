import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../../ui/BottomControls/BottomControls';
import CESDKCanvas from '../../ui/CESDKCanvas/CESDKCanvas';
import TopBar from '../../ui/TopBar/TopBar';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import BookPreviewBar from '../BookPreviewBar/BookPreviewBar';
import classes from './PhotoBookUI.module.css';

const PhotoBookUI = () => {
  const { sceneIsLoaded } = useEditor();

  return (
    <div className={classes.wrapper}>
      <BookPreviewBar />
      <div className={classes.contentWrapper}>
        {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
        <CESDKCanvas isVisible={sceneIsLoaded} key="canvas" />
        {!sceneIsLoaded && <LoadingSpinner />}
        {sceneIsLoaded && (
          <TopBar exportFileName="my-photo-book">
            <h3 className={classes.headline}>Design</h3>
          </TopBar>
        )}
        {/* We want hide the bottom controls in the last step */}
        {sceneIsLoaded && (
          <BottomControls visible DefaultComponent={AddBlockBar} />
        )}
      </div>
    </div>
  );
};

export default PhotoBookUI;
