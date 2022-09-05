import { useEditor } from '../../EditorContext';
import FontSelect from '../FontSelect/FontSelect';

const ChangeFontSecondary = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextFont }
  } = useEditor();

  return (
    <FontSelect
      onSelect={(fontUri) => changeTextFont(fontUri)}
      activeFontUri={selectedTextProperties?.['text/fontFileUri']}
    />
  );
};
export default ChangeFontSecondary;
