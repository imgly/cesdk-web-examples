import { useEditor } from '../../EditorContext';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageAdjustmentBar from '../ImageAdjustmentBar/ImageAdjustmentBar';
import ShapesAdjustmentBar from '../ShapesAdjustmentBar/ShapesAdjustmentBar';
import StickerAdjustmentBar from '../StickerAdjustmentBar/StickerAdjustmentBar';
import TextAdjustmentsBar from '../TextAdjustmentsBar/TextAdjustmentsBar';
import classes from './BottomControls.module.css';
import classNames from 'classnames';
import { useEffect } from 'react';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', component: TextAdjustmentsBar },
  { type: '//ly.img.ubq/image', component: ImageAdjustmentBar },
  { type: '//ly.img.ubq/shapes', component: ShapesAdjustmentBar },
  { type: '//ly.img.ubq/sticker', component: StickerAdjustmentBar }
];

const BottomControls = ({ visible = true }) => {
  const { sceneIsLoaded, selectedBlocks, creativeEngine } = useEditor();

  let ControlComponent = null;

  if (sceneIsLoaded) {
    ControlComponent = AddBlockBar;
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
  // HOTFIX: Fixes initial rendering, 1.10.1 will solve this issue
  useEffect(() => {
    if (!creativeEngine) return;
    const page = creativeEngine.block.findByType('page')[0];
    if (page) {
      Array.from(Array(10).keys()).forEach((i) => {
        setTimeout(() => {
          creativeEngine.block.setRotation(page, 0);
        }, i * 100);
      });
    }
  }, [creativeEngine, selectedBlocks]);

  return (
    // They key is used to force a rerender when ever a different block is selected.
    // The rerender is needed to force the SlideUp Animation
    <div className={classNames(classes.wrapper)} key={selectedBlocks?.[0]?.id}>
      {visible && <ControlComponent />}
    </div>
  );
};
export default BottomControls;
