import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';

import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addSticker = (stickerURI) => {
    const block = creativeEngine.block.create('sticker');
    creativeEngine.block.setString(block, 'sticker/imageFileURI', stickerURI);
    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setHeightMode(block, 'Absolute');
    creativeEngine.block.setHeight(block, pageWidth * 0.25);
    creativeEngine.block.setWidthMode(block, 'Absolute');
    creativeEngine.block.setWidth(block, pageWidth * 0.25);
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
  };

  return <StickerBar onClick={(type) => addSticker(type)} />;
};
export default AddStickerSecondary;
