import { useEffect } from 'react';
import { useEditor } from '../../EditorContext';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import { useProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../../ui/ColorSelect/ColorSelect';

const ChangeBackgroundColorSecondary = () => {
  const { engine } = useEngine();
  const { getColorPalette } = useEditor();
  const { currentPageBlockId } = useSinglePageMode();
  const [backgroundColor, setBackgroundColor] = useProperty(
    currentPageBlockId,
    'fill/solid/color',
    { shouldAddUndoStep: false }
  );

  // Add undo step when component dismounts:
  useEffect(() => {
    return () => {
      if (engine) {
        engine.editor.addUndoStep();
      }
    };
  }, []);

  return (
    <ColorSelect
      onClick={(color) => setBackgroundColor(color)}
      onClickDebounced={() => engine.editor.addUndoStep()}
      activeColor={backgroundColor}
      colorPalette={getColorPalette()}
    />
  );
};
export default ChangeBackgroundColorSecondary;
