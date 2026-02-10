import styles from './BlockLabel.module.css';

import ImageIcon from './icons/image.svg';
import TextIcon from './icons/text.svg';
import ShapeIcon from './icons/shape.svg';
import StickerIcon from './icons/sticker.svg';

export interface IBlockLabel {
  blockType:
    | '//ly.img.ubq/text'
    | '//ly.img.ubq/image'
    | '//ly.img.ubq/sticker'
    | '//ly.img.ubq/shapes/rect'
    | '//ly.img.ubq/shapes/line'
    | '//ly.img.ubq/shapes/star'
    | '//ly.img.ubq/shapes/polygon'
    | '//ly.img.ubq/shapes/ellipse';
  blockName: string;
}

const BLOCK_TYPES = {
  '//ly.img.ubq/text': { icon: TextIcon },
  '//ly.img.ubq/image': { icon: ImageIcon },
  '//ly.img.ubq/sticker': { icon: StickerIcon },
  '//ly.img.ubq/shapes/rect': { icon: ShapeIcon },
  '//ly.img.ubq/shapes/line': { icon: ShapeIcon },
  '//ly.img.ubq/shapes/star': { icon: ShapeIcon },
  '//ly.img.ubq/shapes/polygon': { icon: ShapeIcon },
  '//ly.img.ubq/shapes/ellipse': { icon: ShapeIcon }
};

const BlockLabel = ({ blockType, blockName }: IBlockLabel) => {
  const Icon = BLOCK_TYPES[blockType]?.icon;
  return (
    <div className={styles.wrapper + ' space-x-2'}>
      {Icon && <Icon />}
      <span>{blockName}</span>
    </div>
  );
};

export default BlockLabel;
