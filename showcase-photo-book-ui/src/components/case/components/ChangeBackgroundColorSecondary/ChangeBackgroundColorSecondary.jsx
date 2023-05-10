import { useEditor } from '../../EditorContext';
import { hexToRgb } from '../../lib/CreativeEngineUtils';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import { useProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';

const ChangeBackgroundColorSecondary = () => {
  const { engine } = useEngine();
  const { template } = useEditor();
  const { currentPageBlockId } = useSinglePageMode();
  const [backgroundColor, setBackgroundColor] = useProperty(
    currentPageBlockId,
    'fill/solid/color',
    { shouldAddUndoStep: false }
  );

  return (
    <ColorSelect
      onClick={({ r, g, b, a }) => setBackgroundColor(r, g, b, a)}
      onClickDebounced={() => engine.editor.addUndoStep()}
      activeColor={backgroundColor}
      colorPalette={template.colors.map((color) => hexToRgb(color))}
    />
  );
};
export default ChangeBackgroundColorSecondary;
