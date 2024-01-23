import { useMemo } from 'react';
import { useEditor } from '../../EditorContext';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeTextColorSecondary = () => {
  const { getColorPalette } = useEditor();
  const colorPalette = useMemo(() => getColorPalette(), [getColorPalette]);
  const [textColor, setTextColor] = useSelectedProperty('fill/solid/color');

  return (
    <ColorSelect
      onClick={setTextColor}
      activeColor={textColor}
      colorPalette={colorPalette}
    />
  );
};
export default ChangeTextColorSecondary;
