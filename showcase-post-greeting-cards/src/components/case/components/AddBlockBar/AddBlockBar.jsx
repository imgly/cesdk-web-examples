import { useMemo, useState } from 'react';
import { ReactComponent as ImageIcon } from '../../icons/Image.svg';
import { ReactComponent as ShapeIcon } from '../../icons/Shape.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';

import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '../AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';

const SECONDARY_BARS = {
  text: <AddTextSecondary />,
  image: <AddImageSecondary />,
  sticker: <AddStickerSecondary />,
  shape: <AddShapeSecondary />
};

const AddBlockBar = () => {
  const [secondaryBarId, setSecondaryBarId] = useState();

  const SecondaryBar = useMemo(
    () => SECONDARY_BARS[secondaryBarId] || <></>,
    [secondaryBarId]
  );

  return (
    <>
      {SecondaryBar}
      <DockMenu>
        <IconButton
          isActive
          onClick={() =>
            setSecondaryBarId(secondaryBarId === 'text' ? undefined : 'text')
          }
          icon={<TextIcon />}
        >
          Text
        </IconButton>
        <IconButton
          isActive
          onClick={() =>
            setSecondaryBarId(secondaryBarId === 'image' ? undefined : 'image')
          }
          icon={<ImageIcon />}
        >
          Image
        </IconButton>
        <IconButton
          isActive
          icon={<ShapeIcon />}
          onClick={() =>
            setSecondaryBarId(secondaryBarId === 'shape' ? undefined : 'shape')
          }
        >
          Shape
        </IconButton>
        <IconButton
          isActive
          icon={<StickerIcon />}
          onClick={() =>
            setSecondaryBarId(
              secondaryBarId === 'sticker' ? undefined : 'sticker'
            )
          }
        >
          Sticker
        </IconButton>
      </DockMenu>
    </>
  );
};
export default AddBlockBar;
