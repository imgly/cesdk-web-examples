import { useEditor } from '../../EditorContext';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import { hexToRgb } from '../../lib/CreativeEngineUtils';
import ColorSelect from '../ColorSelect/ColorSelect';
import { useEngine } from '../../lib/EngineContext';

const ChangeTextColorSecondary = () => {
  const { engine } = useEngine();
  const { template } = useEditor();
  const [textColor, setTextColor] = useSelectedProperty('fill/solid/color', {
    shouldAddUndoStep: false
  });

  return (
    <ColorSelect
      onClick={({ r, g, b, a }) => setTextColor(r, g, b, a)}
      onClickDebounced={() => engine.editor.addUndoStep()}
      activeColor={textColor}
      colorPalette={template.colors.map((color) => hexToRgb(color))}
    />
  );
};
export default ChangeTextColorSecondary;
