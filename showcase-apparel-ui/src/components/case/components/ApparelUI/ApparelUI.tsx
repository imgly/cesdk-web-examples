import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../../ui/BottomControls/BottomControls';
import CESDKCanvas from '../../ui/CESDKCanvas/CESDKCanvas';
import TopBar from '../../ui/TopBar/TopBar';
import ProcessNavigation from '../ProcessNavigation/ProcessNavigation';

const ApparelUI = () => {
  const { sceneIsLoaded, currentStep } = useEditor();

  return (
    <>
      {/* Setting the node key allows react to leave the canvas in the dom without rerendering */}
      <CESDKCanvas isVisible={sceneIsLoaded} key="canvas" />
      {!sceneIsLoaded && <LoadingSpinner />}
      {sceneIsLoaded && (
        <TopBar exportFileName="my-t-shirt-design">
          <ProcessNavigation />
        </TopBar>
      )}
      {/* We want hide the bottom controls in the last step */}
      {sceneIsLoaded && <BottomControls visible={currentStep === 'edit'} />}
    </>
  );
};

export default ApparelUI;
