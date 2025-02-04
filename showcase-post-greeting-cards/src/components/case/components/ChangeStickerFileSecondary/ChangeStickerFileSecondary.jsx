import { useEditor } from '../../EditorContext';
import StickerBar from '../StickerBar/StickerBar';

const ChangeStickerFileSecondary = () => {
  const { creativeEngine } = useEditor();

  const changeStickerFile = (value) => {
    const allSelectedStickerElements = creativeEngine.block
      .findAllSelected()
      .filter((elementId) =>
        creativeEngine.block.getType(elementId).includes('sticker')
      );

    if (allSelectedStickerElements.length > 0) {
      allSelectedStickerElements.forEach((stickerElementId) => {
        creativeEngine.block.setString(
          stickerElementId,
          'sticker/imageFileURI',
          value
        );
      });
      creativeEngine.editor.addUndoStep();
    }
  };

  return <StickerBar onClick={(asset) => changeStickerFile(asset.meta.uri)} />;
};
export default ChangeStickerFileSecondary;
