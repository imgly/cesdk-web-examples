import { useMemo } from 'react';
import { useEditor } from '../../EditorContext';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeShapeColorSecondary = () => {
  const { getColorPalette } = useEditor();
  const colorPalette = useMemo(() => getColorPalette(), [getColorPalette]);
  const [shapeColor, setShapeColor] = useSelectedProperty('fill/solid/color');

  return (
    <ColorSelect
      onClick={(color) => setShapeColor(color)}
      activeColor={shapeColor}
      colorPalette={colorPalette}
    />
  );
};
export default ChangeShapeColorSecondary;
