import LayoutIcon from '../../icons/Layout.svg';
import StickerIcon from '../../icons/Sticker.svg';
import ThemeIcon from '../../icons/Theme.svg';
import AddStickerSecondary from '../../ui/AddStickerSecondary/AddStickerSecondary';
import BackgroundColorIcon from '../BackgroundColorIcon/BackgroundColorIcon';
import BlockBar from '../../ui/BlockBar/BlockBar';
import ChangeBackgroundColorSecondary from '../ChangeBackgroundColorSecondary/ChangeBackgroundColorSecondary';
import ChangeLayoutSecondary from '../ChangeLayoutSecondary/ChangeLayoutSecondary';
import ChangeThemeSecondary from '../ChangeThemeSecondary/ChangeThemeSecondary';

const BUTTONS = [
  {
    Component: <ChangeThemeSecondary />,
    Icon: <ThemeIcon />,
    label: 'Theme',
    id: 'theme'
  },
  // layout:
  {
    Component: <ChangeLayoutSecondary />,
    Icon: <LayoutIcon />,
    label: 'Layout',
    id: 'layout'
  },
  // color:
  {
    Component: <ChangeBackgroundColorSecondary />,
    Icon: <BackgroundColorIcon />,
    label: 'Color',
    id: 'color'
  },
  // sticker:
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
