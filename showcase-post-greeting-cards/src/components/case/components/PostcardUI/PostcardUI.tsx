import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../../ui/BottomControls/BottomControls';
import CESDKCanvas from '../../ui/CESDKCanvas/CESDKCanvas';
import ChooseTemplateStep from '../ChooseTemplateStep/ChooseTemplateStep';
import PageToolbar from '../PageToolbar/PageToolbar';
import TopBar from '../../ui/TopBar/TopBar';
import ProcessNavigation from '../ProcessNavigation/ProcessNavigation';
import { useEditMode } from '../../lib/UseEditMode';
import { useEngine } from '../../lib/EngineContext';

const PostcardUI = () => {
  const { sceneIsLoaded, currentStep } = useEditor();
  const { engine } = useEngine();
  const { editMode } = useEditMode({
    engine
  });

  if (currentStep === 'Style') {
    return (
      <>
        <ChooseTemplateStep />
        <CESDKCanvas isVisible={false} key="canvas" />
      </>
    );
  }

  return (
    <>
      {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
      <CESDKCanvas isVisible={sceneIsLoaded} key="canvas" />
      {!sceneIsLoaded && <LoadingSpinner />}
      {sceneIsLoaded && (
        <TopBar>
          <ProcessNavigation disabled={!sceneIsLoaded || editMode === 'Crop'} />
        </TopBar>
      )}
      {sceneIsLoaded && <PageToolbar />}
      {/* We want hide the bottom controls in the last step */}
      {sceneIsLoaded && <BottomControls visible={currentStep === 'Design'} />}
    </>
  );
};

export default PostcardUI;
