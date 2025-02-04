import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import IconButton from '../IconButton/IconButton';

export const ALL_STICKER = [
  {
    id: 'ly.img.sticker/hand/images/hand_friends.svg',
    label: {
      en: 'Best friends'
    },
    tags: {},
    meta: {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_friends.svg',
      thumbUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_friends.svg',
      filename: 'hand_friends.svg',
      blockType: '//ly.img.ubq/sticker',
      width: 2048,
      height: 1339
    }
  },
  {
    id: 'ly.img.sticker/hand/images/hand_vibes.svg',
    label: {
      en: 'Good vibes only'
    },
    tags: {},
    meta: {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_vibes.svg',
      thumbUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_vibes.svg',
      filename: 'hand_vibes.svg',
      blockType: '//ly.img.ubq/sticker',
      width: 2048,
      height: 1339
    }
  },
  {
    id: 'ly.img.sticker/hand/images/hand_five.svg',
    label: {
      en: 'High five'
    },
    tags: {},
    meta: {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_five.svg',
      thumbUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_five.svg',
      filename: 'hand_five.svg',
      blockType: '//ly.img.ubq/sticker',
      width: 2048,
      height: 1339
    }
  },
  {
    id: 'ly.img.sticker/hand/images/hand_fuck.svg',
    label: {
      en: 'Fuck the rules'
    },
    tags: {},
    meta: {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_fuck.svg',
      thumbUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.2/assets/extensions/ly.img.cesdk.stickers.hand/images/hand_fuck.svg',
      filename: 'hand_fuck.svg',
      blockType: '//ly.img.ubq/sticker',
      width: 2048,
      height: 1339
    }
  }
];

const StickerBar = ({ onClick }) => {
  return (
    <AdjustmentsBar gap="md">
      {ALL_STICKER.map((asset) => (
        <IconButton
          key={asset.id}
          onClick={() => onClick(asset)}
          icon={<img src={asset.meta.thumbUri} alt={asset.label.en} />}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default StickerBar;
