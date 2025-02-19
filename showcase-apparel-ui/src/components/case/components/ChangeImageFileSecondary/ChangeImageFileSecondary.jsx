import { useEditor } from '../../EditorContext';
import ImagesBar from '../ImageBar/ImageBar';

const ChangeImageFileSecondary = () => {
  const {
    customEngine: { changeImageFile }
  } = useEditor();

  return <ImagesBar onSelect={(fontUri) => changeImageFile(fontUri)} />;
};
export default ChangeImageFileSecondary;
