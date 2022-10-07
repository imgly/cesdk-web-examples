import { useEditor } from '../../EditorContext';

import StickerBar from '../StickerBar/StickerBar';

const AddStickerSecondary = () => {
  const {
    customEngine: { addSticker }
  } = useEditor();

  return <StickerBar onClick={(type) => addSticker(type)} />;
};
export default AddStickerSecondary;
