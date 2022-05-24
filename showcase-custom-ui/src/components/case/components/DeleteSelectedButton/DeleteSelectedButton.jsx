import { useEditor } from '../../EditorContext';
import IconButton from '../IconButton/IconButton';
import { ReactComponent as TrashBinIcon } from '../../icons/TrashBin.svg';
import useStream from '../../lib/streams/useStream';

const ALLOWED_DELETION_TYPES = [
  '//ly.img.ubq/text',
  '//ly.img.ubq/image',
  '//ly.img.ubq/shapes',
  '//ly.img.ubq/sticker'
];

const DeleteSelectedButton = () => {
  const {
    customEngine: {
      deleteSelectedElement,
      selectedBlocksStream,
      getSelectedBlockWithTypes
    }
  } = useEditor();
  const selectedBlocks = useStream(selectedBlocksStream, () =>
    getSelectedBlockWithTypes()
  );
  const selectedBlockType =
    selectedBlocks?.length === 1 && selectedBlocks[0].type;

  if (
    !selectedBlocks ||
    !ALLOWED_DELETION_TYPES.find((type) => selectedBlockType.startsWith(type))
  ) {
    return <></>;
  }
  return (
    <IconButton
      onClick={() => deleteSelectedElement()}
      icon={<TrashBinIcon />}
      iconColor="red"
    >
      Delete
    </IconButton>
  );
};
export default DeleteSelectedButton;
