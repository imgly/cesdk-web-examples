import { useEditor } from '../../EditorContext';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import { hexToRgb } from '../../lib/CreativeEngineUtils';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeTextColorSecondary = () => {
  const { postcardTemplate } = useEditor();
  const [textColor, setTextColor] = useSelectedProperty('fill/solid/color');

  return (
    <ColorSelect
      onClick={({ r, g, b, a }) => setTextColor(r, g, b, a)}
      activeColor={textColor}
      colorPalette={postcardTemplate.colors.map((color) => hexToRgb(color))}
    />
  );
};
export default ChangeTextColorSecondary;
