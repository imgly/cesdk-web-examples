import { useEditor } from '../../EditorContext';

import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const {
    customEngine: { addSticker }
  } = useEditor();

  return <StickerBar onClick={(asset) => addSticker(asset.meta.uri)} />;
};
export default AddStickerSecondary;
