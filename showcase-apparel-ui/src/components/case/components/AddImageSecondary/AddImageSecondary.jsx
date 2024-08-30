import { useEditor } from '../../EditorContext';
import ImagesBar from '../ImageBar/ImageBar';

const AddImageSecondary = () => {
  const {
    customEngine: { addImage }
  } = useEditor();

  return <ImagesBar onSelect={(image) => addImage(image)} />;
};
export default AddImageSecondary;
