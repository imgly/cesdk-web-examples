import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as LayoutIcon } from '../../icons/Layout.svg';
import { ReactComponent as StickerIcon } from '../../icons/Sticker.svg';
import { ReactComponent as ThemeIcon } from '../../icons/Theme.svg';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';

import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import BackgroundColorIcon from '../BackgroundColorIcon/BackgroundColorIcon';
import ChangeBackgroundColorSecondary from '../ChangeBackgroundColorSecondary/ChangeBackgroundColorSecondary';
import ChangeLayoutSecondary from '../ChangeLayoutSecondary/ChangeLayoutSecondary';
import ChangeThemeSecondary from '../ChangeThemeSecondary/ChangeThemeSecondary';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';

const SECONDARY_BARS = {
  text: <AddTextSecondary />,
  image: <AddImageSecondary />,
  sticker: <AddStickerSecondary />,
  layout: <ChangeLayoutSecondary />,
  color: <ChangeBackgroundColorSecondary />,
  theme: <ChangeThemeSecondary />
};

const AddBlockBar = () => {
  const { currentPageBlockId } = useSinglePageMode();
  const [secondaryBarId, setSecondaryBarId] = useState();

  const SecondaryBar = useMemo(
    () => SECONDARY_BARS[secondaryBarId] || <></>,
    [secondaryBarId]
  );

  useEffect(
    function resetSecondaryBarOnPageChange() {
      // The layout mechanism changes the pageId, but we want to keep the layout bar open still.
      if (currentPageBlockId && secondaryBarId !== 'layout') {
        setSecondaryBarId();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPageBlockId]
  );

  return (
    <>
      {SecondaryBar}
      <DockMenu>
        <IconButton
          isActive={secondaryBarId === 'theme'}
          icon={<ThemeIcon />}
          onClick={() =>
            setSecondaryBarId(secondaryBarId === 'theme' ? undefined : 'theme')
          }
        >
          Theme
        </IconButton>
        <IconButton
          isActive={secondaryBarId === 'layout'}
          icon={<LayoutIcon />}
          onClick={() =>
            setSecondaryBarId(
              secondaryBarId === 'layout' ? undefined : 'layout'
            )
          }
        >
          Layout
        </IconButton>
        <IconButton
          isActive={secondaryBarId === 'color'}
          icon={<BackgroundColorIcon />}
          onClick={() =>
            setSecondaryBarId(secondaryBarId === 'color' ? undefined : 'color')
          }
        >
          Color
        </IconButton>
        <IconButton
          isActive={
            secondaryBarId === 'sticker' || secondaryBarId === undefined
          }
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
