import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';
import BottomControls from '../BottomControls/BottomControls';
import CESDKCanvas from '../CESDKCanvas/CESDKCanvas';
import TopBar from '../TopBar/TopBar';

const MobileUI = () => {
  const { isLoaded } = useEditor();


  return (
    <>
      {!isLoaded && <LoadingSpinner />}
      {isLoaded && <TopBar />}
      <CESDKCanvas />
      {isLoaded && <BottomControls />}
    </>
  );
};

export default MobileUI;
