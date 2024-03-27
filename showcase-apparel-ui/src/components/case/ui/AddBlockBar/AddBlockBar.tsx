import ImageIcon from '../../icons/Image.svg';
import ShapeIcon from '../../icons/Shape.svg';
import StickerIcon from '../../icons/Sticker.svg';
import TextIcon from '../../icons/Text.svg';
import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '../AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import BlockBar from '../BlockBar/BlockBar';

const BUTTONS = [
  {
    Component: <AddTextSecondary />,
    Icon: <TextIcon />,
    label: 'Text',
    id: 'text'
  },
  {
    Component: <AddImageSecondary />,
    Icon: <ImageIcon />,
    label: 'Image',
    id: 'image'
  },
  {
    Component: <AddShapeSecondary />,
    Icon: <ShapeIcon />,
    label: 'Shape',
    id: 'shape'
  },
  {
    Component: <AddStickerSecondary />,
    Icon: <StickerIcon />,
    label: 'Sticker',
    id: 'sticker'
  }
];

const AddBlockBar = () => {
  return <BlockBar items={BUTTONS} />;
};

export default AddBlockBar;
