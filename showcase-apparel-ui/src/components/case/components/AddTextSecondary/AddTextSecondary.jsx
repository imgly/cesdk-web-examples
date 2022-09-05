import { useEditor } from '../../EditorContext';
import FontSelect from '../FontSelect/FontSelect';

const AddTextSecondary = () => {
  const {
    customEngine: { addText }
  } = useEditor();

  return <FontSelect onSelect={(font) => addText(font)} />;
};
export default AddTextSecondary;
