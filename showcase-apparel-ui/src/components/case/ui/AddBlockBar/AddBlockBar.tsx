import { ReactComponent as ImageIcon } from '../../icons/Image.svg';
import { ReactComponent as ShapeIcon } from '../../icons/Shape.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
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
