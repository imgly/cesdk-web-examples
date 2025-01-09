import classNames from 'classnames';
import { useMemo } from 'react';
import { useEngine } from '../../lib/EngineContext';
import { useSelection } from '../../lib/UseSelection';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageAdjustmentBar from '../ImageAdjustmentBar/ImageAdjustmentBar';
import ShapesAdjustmentBar from '../ShapesAdjustmentBar/ShapesAdjustmentBar';
import StickerAdjustmentBar from '../StickerAdjustmentBar/StickerAdjustmentBar';
import TextAdjustmentsBar from '../TextAdjustmentsBar/TextAdjustmentsBar';
import classes from './BottomControls.module.css';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', kind: 'text', component: TextAdjustmentsBar },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'image',
    component: ImageAdjustmentBar
  },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'shape',
    component: ShapesAdjustmentBar
  },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'sticker',
    component: StickerAdjustmentBar
  }
];

const BottomControls = ({ DefaultComponent = AddBlockBar, visible = true }) => {
  const { engine } = useEngine();
  const { selection } = useSelection();

  let ControlComponent = DefaultComponent;

  const selectedBlock = useMemo<null | {
    id: number;
    type: string;
    kind: string;
  }>(() => {
    if (!selection || selection.length !== 1) return null;

    return {
      id: selection[0],
      type: engine.block.getType(selection[0]),
      kind: engine.block.getKind(selection[0])
    };
  }, [selection, engine]);

  if (selectedBlock) {
    const blockControl = BLOCK_TYPE_TO_CONTROLS.find(
      ({ type, kind }) =>
        selectedBlock.type.startsWith(type) &&
        selectedBlock.kind.startsWith(kind)
    );
    if (blockControl) {
      ControlComponent = blockControl.component;
    }
  }

  return (
    // They key is used to force a rerender when ever a different block is selected.
    // The rerender is needed to force the SlideUp Animation
    <div className={classNames(classes.wrapper)} key={selectedBlock?.id}>
      {visible && <ControlComponent />}
    </div>
  );
};
export default BottomControls;
