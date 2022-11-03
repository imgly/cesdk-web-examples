import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import ChooseTemplateStep from '../ChooseTemplateStep/ChooseTemplateStep';
import PageToolbar from '../PageToolbar/PageToolbar';
import TopBar from '../TopBar/TopBar';

const PostcardUI = () => {
  const { sceneIsLoaded, currentStep } = useEditor();


  if (currentStep === 'Style') {
    return (
      <>
        <ChooseTemplateStep />
        <CESDKCanvas key="canvas" />
      </>
    );
  }

  return (
    <>
      {!sceneIsLoaded && <LoadingSpinner />}
      {sceneIsLoaded && <TopBar />}
      {sceneIsLoaded && <PageToolbar />}
      {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
      <CESDKCanvas key="canvas" />
      {/* We want hide the bottom controls in the last step */}
      <BottomControls visible={sceneIsLoaded && currentStep === 'Design'} />
    </>
  );
};

export default PostcardUI;
