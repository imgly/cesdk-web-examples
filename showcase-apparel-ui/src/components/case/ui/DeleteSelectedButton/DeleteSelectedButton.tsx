import { useSelection } from '../../lib/UseSelection';
import { ReactComponent as TrashBinIcon } from '../../icons/TrashBin.svg';
import { useEngine } from '../../lib/EngineContext';
import IconButton from '../IconButton/IconButton';

const DeleteSelectedButton = ({ isActive = false }) => {
  const { engine } = useEngine();
  const { selection } = useSelection({ engine });

  const deleteSelectedElement = () => {
    if (engine.editor.getEditMode() === 'Crop') {
      engine.editor.setEditMode('Transform');
    }
    const selectedBlocks = engine.block.findAllSelected();
    selectedBlocks.forEach((pageId) => {
      engine.block.destroy(pageId);
    });
    engine.editor.addUndoStep();
  };

  if (
    !selection.every((block) =>
      engine.block.isAllowedByScope(block, 'lifecycle/destroy')
    )
  ) {
    return null;
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
