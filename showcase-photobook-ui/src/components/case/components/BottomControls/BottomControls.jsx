import classNames from 'classnames';
import { useEngine } from '../../lib/EngineContext';
import { useSelection } from '../../lib/useSelection';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageAdjustmentBar from '../ImageAdjustmentBar/ImageAdjustmentBar';
import StickerAdjustmentBar from '../StickerAdjustmentBar/StickerAdjustmentBar';
import TextAdjustmentsBar from '../TextAdjustmentsBar/TextAdjustmentsBar';
import classes from './BottomControls.module.css';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', component: <TextAdjustmentsBar /> },
  { type: '//ly.img.ubq/image', component: <ImageAdjustmentBar /> },
  { type: '//ly.img.ubq/sticker', component: <StickerAdjustmentBar /> }
];

const BottomControls = ({ visible = true }) => {
  const { engine } = useEngine();
  const { selection } = useSelection();

  const selectedBlockType =
    selection?.length === 1 && engine.block.getType(selection[0]);

  let ControlComponent = <AddBlockBar />;
  if (!!selectedBlockType) {
    const blockControl = BLOCK_TYPE_TO_CONTROLS.find(({ type }) =>
      selectedBlockType.startsWith(type)
    );
    if (blockControl) {
      ControlComponent = blockControl.component;
    }
  }

  return (
    // They key is used to force a rerender when ever a different block is selected.
    // The rerender is needed to force the SlideUp Animation
    <div className={classNames(classes.wrapper)} key={selection[0]}>
      {visible && ControlComponent}
    </div>
  );
};
export default BottomControls;
