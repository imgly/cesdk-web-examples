import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';

const MobileUI = () => {
  const { engineIsLoaded } = useEditor();

  return (
    <>
      {!engineIsLoaded && <LoadingSpinner />}
      {engineIsLoaded && <TopBar />}
      <CESDKCanvas />
      {engineIsLoaded && <BottomControls />}
    </>
  );
};

export default MobileUI;
