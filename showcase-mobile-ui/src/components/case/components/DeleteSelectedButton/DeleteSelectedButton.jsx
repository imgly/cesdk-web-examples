import { useEditor } from '../../EditorContext';
import TrashBinIcon from '../../icons/TrashBin.svg';
import IconButton from '../IconButton/IconButton';

const ALLOWED_DELETION_TYPES = ['text', 'image', 'shape', 'sticker'];

const DeleteSelectedButton = ({ isActive = false }) => {
  const { selectedBlocks, engine } = useEditor();
  const selectedBlockType =
    selectedBlocks?.length === 1 && selectedBlocks[0].type;

  const deleteSelectedElement = () => {
    const selectedBlocks = engine.block.findAllSelected();
    if (engine.editor.getEditMode() === 'Crop') {
      engine.editor.setEditMode('Transform');
    }
    selectedBlocks.forEach((pageId) => {
      engine.block.destroy(pageId);
    });
    engine.editor.addUndoStep();
  };

  if (
    !selectedBlocks ||
    !ALLOWED_DELETION_TYPES.find((type) => selectedBlockType?.startsWith(type))
  ) {
    return <></>;
  }
  return (
    <IconButton
      onClick={() => deleteSelectedElement()}
      icon={<TrashBinIcon />}
      iconColor="red"
      isActive={isActive}
    >
      Delete
    </IconButton>
  );
};
export default DeleteSelectedButton;
