import { useEditor } from '../../EditorContext';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeShapeColorSecondary = () => {
  const {
    selectedShapeProperties,
    customEngine: { changeShapeColor }
  } = useEditor();

  return (
    <ColorSelect
      onClick={(color) => changeShapeColor(color)}
      activeColor={selectedShapeProperties['fill/solid/color']}
    />
  );
};
export default ChangeShapeColorSecondary;
