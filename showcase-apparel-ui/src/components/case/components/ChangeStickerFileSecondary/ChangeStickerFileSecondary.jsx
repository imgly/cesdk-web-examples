import { useEditor } from '../../EditorContext';
import StickerBar from '../StickerBar/StickerBar';

const ChangeStickerFileSecondary = () => {
  const {
    customEngine: { changeStickerFile }
  } = useEditor();

  return <StickerBar onClick={(color) => changeStickerFile(color)} />;
};
export default ChangeStickerFileSecondary;
