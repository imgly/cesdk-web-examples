import { useEditor } from '../../EditorContext';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageAdjustmentBar from '../ImageAdjustmentBar/ImageAdjustmentBar';
import ShapesAdjustmentBar from '../ShapesAdjustmentBar/ShapesAdjustmentBar';
import StickerAdjustmentBar from '../StickerAdjustmentBar/StickerAdjustmentBar';
import TextAdjustmentsBar from '../TextAdjustmentsBar/TextAdjustmentsBar';
import classes from './BottomControls.module.css';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', component: <TextAdjustmentsBar /> },
  { type: '//ly.img.ubq/image', component: <ImageAdjustmentBar /> },
  { type: '//ly.img.ubq/shapes', component: <ShapesAdjustmentBar /> },
  { type: '//ly.img.ubq/sticker', component: <StickerAdjustmentBar /> }
];

const BottomControls = () => {
  const { isEditable, selectedBlocks } = useEditor();

  let ControlComponent = <AddBlockBar />;

  if (!isEditable) {
    return null;
  }
  const selectedBlockType =
    selectedBlocks?.length === 1 && selectedBlocks[0].type;
  if (!!selectedBlockType) {
    const blockControl = BLOCK_TYPE_TO_CONTROLS.find(({ type }) =>
      selectedBlockType.startsWith(type)
    );
    if (blockControl) {
      ControlComponent = blockControl.component;
    }
  }

  return <div className={classes.wrapper}>{ControlComponent}</div>;
};
export default BottomControls;
