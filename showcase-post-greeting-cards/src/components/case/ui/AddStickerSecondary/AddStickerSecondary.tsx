import { useEngine } from '../../lib/EngineContext';
import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const { engine } = useEngine();

  return (
    <StickerBar
      onClick={(asset) => engine.asset.apply(asset.context.sourceId, asset)}
    />
  );
};
export default AddStickerSecondary;
