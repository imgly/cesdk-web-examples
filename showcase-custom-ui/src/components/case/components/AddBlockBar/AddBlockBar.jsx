import { useEditor } from '../../EditorContext';
import IconButton from '../IconButton/IconButton';

import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as ImageIcon } from '../../icons/Image.svg';
import { ReactComponent as ShapeIcon } from '../../icons/Shape.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ALL_IMAGES } from '../ImageBar/ImageBar';
import { ALL_SHAPES } from '../ShapesBar/ShapesBar';
import { ALL_STICKER } from '../StickerBar/StickerBar';

const AddBlockBar = () => {
  const {
    customEngine: { addText, addImage, addShape, addSticker }
  } = useEditor();

  return (
    <div className="align-center flex justify-center">
      <IconButton onClick={() => addText()} icon={<TextIcon />}>
        Text
      </IconButton>
      <IconButton onClick={() => addImage(ALL_IMAGES[0])} icon={<ImageIcon />}>
        Image
      </IconButton>
      <IconButton
        icon={<ShapeIcon />}
        onClick={() => addShape(ALL_SHAPES[0].type)}
      >
        Shape
      </IconButton>
      <IconButton
        icon={<StickerIcon />}
        onClick={() => addSticker(ALL_STICKER[0].type)}
      >
        Sticker
      </IconButton>
    </div>
  );
};
export default AddBlockBar;
