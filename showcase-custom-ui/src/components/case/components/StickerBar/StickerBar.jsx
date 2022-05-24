import { useEditor } from '../../EditorContext';

import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';

import { ReactComponent as HandFriendsIcon } from '../../icons/sticker/hand_friends.svg';
import { ReactComponent as HandVibesIcon } from '../../icons/sticker/hand_vibes.svg';
import { ReactComponent as HandFiveIcon } from '../../icons/sticker/hand_five.svg';
import { ReactComponent as HandFuckIcon } from '../../icons/sticker/hand_fuck.svg';
import { ReactComponent as HandHeartIcon } from '../../icons/sticker/hand_heart.svg';

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
  },
  {
    type: '/extensions/ly.img.cesdk.stickers.hand/images/hand_heart.svg',
    label: 'You and me',
    icon: <HandHeartIcon />
  }
];

const StickerBar = () => {
  const {
    customEngine: { changeStickerFile }
  } = useEditor();

  return (
    <div className="flex justify-center gap-6">
      <div className="flex">
        {ALL_STICKER.map(({ type, icon }) => (
          <IconButton
            key={type}
            onClick={() => changeStickerFile(type)}
            icon={icon}
          ></IconButton>
        ))}
      </div>
      <div>
        <DeleteSelectedButton />
      </div>
    </div>
  );
};
export default StickerBar;
