import { useEditor } from '../../EditorContext';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeTextColorSecondary = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextColor }
  } = useEditor();

  return (
    <ColorSelect
      onClick={(color) => changeTextColor(color)}
      activeColor={selectedTextProperties['fill/color']}
    />
  );
};
export default ChangeTextColorSecondary;
