import { useEditor } from '../../EditorContext';
import StickerBar from '../StickerBar/StickerBar';

const ChangeStickerFileSecondary = () => {
  const {
    customEngine: { changeStickerFile }
  } = useEditor();
  return <StickerBar onClick={(asset) => changeStickerFile(asset.meta.uri)} />;
};
export default ChangeStickerFileSecondary;
