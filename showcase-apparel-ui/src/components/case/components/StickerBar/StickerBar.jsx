import { ReactComponent as HandFiveIcon } from '../../icons/sticker/hand_five.svg';
import { ReactComponent as HandFriendsIcon } from '../../icons/sticker/hand_friends.svg';
import { ReactComponent as HandFuckIcon } from '../../icons/sticker/hand_fuck.svg';
import { ReactComponent as HandVibesIcon } from '../../icons/sticker/hand_vibes.svg';

import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import IconButton from '../IconButton/IconButton';

export const ALL_STICKER = [
  {
    type: '/extensions/ly.img.cesdk.stickers.hand/images/hand_friends.svg',
    label: 'Best friends',
    icon: <HandFriendsIcon />
  },
  {
    type: '/extensions/ly.img.cesdk.stickers.hand/images/hand_vibes.svg',
    label: 'Good vibes only',
    icon: <HandVibesIcon />
  },
  {
    type: '/extensions/ly.img.cesdk.stickers.hand/images/hand_five.svg',
    label: 'High five',
    icon: <HandFiveIcon />
  },
  {
    type: '/extensions/ly.img.cesdk.stickers.hand/images/hand_fuck.svg',
    label: 'Fuck the rules',
    icon: <HandFuckIcon />
  }
];

const StickerBar = ({ onClick }) => {
  return (
    <AdjustmentsBar gap="md">
      {ALL_STICKER.map(({ type, icon }) => (
        <IconButton
          key={type}
          onClick={() => onClick(type)}
          icon={icon}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default StickerBar;
