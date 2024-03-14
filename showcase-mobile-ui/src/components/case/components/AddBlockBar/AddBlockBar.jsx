import { useMemo, useState } from 'react';
import ImageIcon from '../../icons/Image.svg';
import ShapeIcon from '../../icons/Shape.svg';
import StickerIcon from '../../icons/Sticker.svg';
import TextIcon from '../../icons/Text.svg';
import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '../AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import IconButton from '../IconButton/IconButton';
import classes from './AddBlockBar.module.css';

const SECONDARY_PANELS = [
  { id: 'text', Component: AddTextSecondary, Icon: <TextIcon /> },
  { id: 'image', Component: AddImageSecondary, Icon: <ImageIcon /> },
  { id: 'sticker', Component: AddStickerSecondary, Icon: <StickerIcon /> },
  { id: 'shape', Component: AddShapeSecondary, Icon: <ShapeIcon /> }
];

const AddBlockBar = () => {
  const [secondaryPanelId, setSecondaryPanelId] = useState();
  const SecondaryPanel = useMemo(
    () => SECONDARY_PANELS.find(({ id }) => secondaryPanelId === id)?.Component,
    [secondaryPanelId]
  );

  return (
    <>
      {SecondaryPanel && (
        <SecondaryPanel onClose={() => setSecondaryPanelId()} />
      )}
      <div className={classes.wrapper}>
        {SECONDARY_PANELS.map(({ id, Icon }) => (
          <IconButton
            key={id}
            theme="menu"
            onClick={() => setSecondaryPanelId(id)}
            icon={Icon}
          />
        ))}
      </div>
    </>
  );
};
export default AddBlockBar;
