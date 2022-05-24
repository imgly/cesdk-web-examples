import { useEditor } from '../../EditorContext';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import TextBar from '../TextBar/TextBar';
import ImageBar from '../ImageBar/ImageBar';
import ShapesBar from '../ShapesBar/ShapesBar';
import StickerBar from '../StickerBar/StickerBar';

import classes from './BottomControls.module.css';
import useStream from '../../lib/streams/useStream';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', component: <TextBar /> },
  { type: '//ly.img.ubq/image', component: <ImageBar /> },
  { type: '//ly.img.ubq/shapes', component: <ShapesBar /> },
  { type: '//ly.img.ubq/sticker', component: <StickerBar /> }
];

const BottomControls = () => {
  const {
    isEditable,
    customEngine: { selectedBlocksStream }
  } = useEditor();
  const selectedBlocks = useStream(selectedBlocksStream);

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
