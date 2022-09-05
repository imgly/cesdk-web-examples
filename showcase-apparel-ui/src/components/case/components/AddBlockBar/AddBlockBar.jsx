import { useMemo, useState } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as ImageIcon } from '../../icons/Image.svg';
import { ReactComponent as ShapeIcon } from '../../icons/Shape.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { uploadFile } from '../../lib/upload';
import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '../AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickeSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import IconButton from '../IconButton/IconButton';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

const SECONDARY_BARS = {
  TEXT: <AddTextSecondary />,
  IMAGE: <AddImageSecondary />,
  STICKER: <AddStickerSecondary />,
  SHAPE: <AddShapeSecondary />
};

const AddBlockBar = () => {
  const [secondaryBarId, setSecondaryBarId] = useState();
  const {
    customEngine: { addImage }
  } = useEditor();
  const SecondaryBar = useMemo(
    () => SECONDARY_BARS[secondaryBarId] || <></>,
    [secondaryBarId]
  );

  return (
    <div className="align-center gap-xs flex flex-col">
      {SecondaryBar}
      <div className="gap-xs align-center flex justify-center">
        <IconButton
          isActive
          onClick={() => setSecondaryBarId('TEXT')}
          icon={<TextIcon />}
        >
          Text
        </IconButton>
        <IconButton
          isActive
          onClick={() => setSecondaryBarId('IMAGE')}
          icon={<ImageIcon />}
        >
          Image
        </IconButton>
        <IconButton
          isActive
          icon={<ShapeIcon />}
          onClick={() => setSecondaryBarId('SHAPE')}
        >
          Shape
        </IconButton>
        <IconButton
          isActive
          icon={<StickerIcon />}
          onClick={() => setSecondaryBarId('STICKER')}
        >
          Sticker
        </IconButton>
        <IconButton
          isActive
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
    </div>
  );
};
export default AddBlockBar;
