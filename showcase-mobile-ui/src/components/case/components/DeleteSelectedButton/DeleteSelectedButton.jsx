import { useEditor } from '../../EditorContext';
import { ReactComponent as TrashBinIcon } from '../../icons/TrashBin.svg';
import IconButton from '../IconButton/IconButton';

const ALLOWED_DELETION_TYPES = [
  '//ly.img.ubq/text',
  '//ly.img.ubq/image',
  '//ly.img.ubq/shapes',
  '//ly.img.ubq/vector_path',
  '//ly.img.ubq/sticker'
];

const DeleteSelectedButton = ({ isActive = false }) => {
  const {
    selectedBlocks,
    customEngine: { deleteSelectedElement }
  } = useEditor();
  const selectedBlockType =
    selectedBlocks?.length === 1 && selectedBlocks[0].type;

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
