import { useEditor } from '../../EditorContext';
import { ReactComponent as ImageIcon } from '../../icons/Image.svg';
import { ReactComponent as ShapeIcon } from '../../icons/Shape.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { uploadFile } from '../../lib/upload';
import IconButton from '../IconButton/IconButton';
import { ALL_IMAGES } from '../ImageBar/ImageBar';
import { ALL_SHAPES } from '../ShapesBar/ShapesBar';
import { ALL_STICKER } from '../StickerBar/StickerBar';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

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
      <IconButton
        icon={<UploadIcon />}
        onClick={async () => {
          const files = await uploadFile({
            supportedMimeTypes: SUPPORTED_MIME_TYPES
          });

          const file = files[0];
          if (file) {
            addImage(window.URL.createObjectURL(file));
          }
        }}
      >
        Upload
      </IconButton>
    </div>
  );
};
export default AddBlockBar;
