import { useMemo } from 'react';
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
  { type: '//ly.img.ubq/vector_path', component: <ShapesAdjustmentBar /> },
  { type: '//ly.img.ubq/sticker', component: <StickerAdjustmentBar /> }
];

const BottomControls = () => {
  const { isEditable, selectedBlocks } = useEditor();

  const ControlComponent = useMemo(() => {
    const selectedBlockType =
      selectedBlocks?.length === 1 && selectedBlocks[0].type;
    return (
      BLOCK_TYPE_TO_CONTROLS.find(
        ({ type }) => selectedBlockType && selectedBlockType.startsWith(type)
      )?.component ?? <AddBlockBar />
    );
  }, [selectedBlocks]);

  if (!isEditable) {
    return null;
  }
  return <div className={classes.wrapper}>{ControlComponent}</div>;
};
export default BottomControls;
