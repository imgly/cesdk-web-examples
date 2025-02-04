import { useEditor } from '../../EditorContext';
import { hexToRgb } from '../../lib/CreativeEngineUtils';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeShapeColorSecondary = () => {
  const { postcardTemplate } = useEditor();
  const [shapeColor, setShapeColor] = useSelectedProperty('fill/solid/color');

  return (
    <ColorSelect
      onClick={({ r, g, b, a }) => setShapeColor(r, g, b, a)}
      activeColor={shapeColor}
      colorPalette={postcardTemplate.colors.map((color) => hexToRgb(color))}
    />
  );
};
export default ChangeShapeColorSecondary;
