import { useEditor } from '../../EditorContext';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageBar from '../ImageBar/ImageBar';
import ShapesBar from '../ShapesBar/ShapesBar';
import StickerBar from '../StickerBar/StickerBar';
import TextBar from '../TextBar/TextBar';
import classes from './BottomControls.module.css';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', component: <TextBar /> },
  { type: '//ly.img.ubq/image', component: <ImageBar /> },
  { type: '//ly.img.ubq/shapes', component: <ShapesBar /> },
  { type: '//ly.img.ubq/sticker', component: <StickerBar /> }
];

const BottomControls = () => {
  const {
    isEditable,
    editorState: { editMode },
    selectedBlocks
  } = useEditor();

  let ControlComponent = <AddBlockBar />;

  if (!isEditable || editMode === 'Crop') {
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

  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperCentering}>{ControlComponent}</div>
    </div>
  );
};
export default BottomControls;
