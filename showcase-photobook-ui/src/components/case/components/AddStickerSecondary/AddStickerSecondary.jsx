import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  return (
    <StickerBar
      onClick={async (stickerAsset) => {
        const sticker = await engine.asset.defaultApplyAsset(stickerAsset);
        engine.block.appendChild(currentPageBlockId, sticker);
      }}
    />
  );
};
export default AddStickerSecondary;
