import { ReactComponent as TrashBinIcon } from '../../icons/TrashBin.svg';
import { useEngine } from '../../lib/EngineContext';
import { useSelection } from '../../lib/useSelection';
import IconButton from '../IconButton/IconButton';

const ALLOWED_DELETION_TYPES = [
  '//ly.img.ubq/text',
  '//ly.img.ubq/image',
  '//ly.img.ubq/shapes',
  '//ly.img.ubq/sticker'
];

const DeleteSelectedButton = ({ isActive = false }) => {
  const { engine } = useEngine();
  const { selection } = useSelection();

  const deleteSelectedElement = () => {
    const selectedBlocks = engine.block.findAllSelected();
    selectedBlocks.forEach((pageId) => {
      engine.block.destroy(pageId);
    });
    engine.editor.addUndoStep();
  };

  const selectedBlockType =
    selection.length === 1 && engine.block.getType(selection[0]);

  const isDestroyAllowed = engine.block
    .getType(selection[0])
    .includes('sticker');

  if (
    !selection ||
    !ALLOWED_DELETION_TYPES.find((type) =>
      selectedBlockType?.startsWith(type)
    ) ||
    !isDestroyAllowed
  ) {
    return <></>;
  }
  return (
    <IconButton
      onClick={() => deleteSelectedElement()}
      icon={<TrashBinIcon />}
      iconColor="red"
      isActive={isActive}
      style={{ marginLeft: '2rem' }}
    >
      Delete
    </IconButton>
  );
};
export default DeleteSelectedButton;
