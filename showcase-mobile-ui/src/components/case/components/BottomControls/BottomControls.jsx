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
  const { engineIsLoaded, selectedBlocks } = useEditor();

  const ControlComponent = useMemo(() => {
    const selectedBlockType =
      selectedBlocks?.length === 1 && selectedBlocks[0].type;
    return (
      BLOCK_TYPE_TO_CONTROLS.find(
        ({ type }) => selectedBlockType && selectedBlockType.startsWith(type)
      )?.component ?? <AddBlockBar />
    );
  }, [selectedBlocks]);

  if (!engineIsLoaded) {
    return null;
  }
  // The key is used to force the closing of any open menus
  // when the selected block changes
  return (
    <div className={classes.wrapper} key={selectedBlocks?.[0]?.id}>
      {ControlComponent}
    </div>
  );
};
export default BottomControls;
