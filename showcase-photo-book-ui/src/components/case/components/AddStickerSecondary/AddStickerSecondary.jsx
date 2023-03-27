import { useEngine } from '../../lib/EngineContext';
import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const { engine } = useEngine();

  return (
    <StickerBar
      onClick={(stickerAsset) => engine.asset.defaultApplyAsset(stickerAsset)}
    />
  );
};
export default AddStickerSecondary;
