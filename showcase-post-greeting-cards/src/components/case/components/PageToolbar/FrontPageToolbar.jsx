import { useEditor } from '../../EditorContext';
import { usePageSettings } from '../../PageSettingsContext';
import ColorDropdown from '../ColorDropdown/ColorDropdown';

const FrontPageToolbar = () => {
  const { postcardTemplate } = useEditor();
  const {
    frontAccentColor,
    setFrontAccentColor,
    frontBackgroundColor,
    setFrontBackgroundColor
  } = usePageSettings();

  return (
    <>
      <ColorDropdown
        label="Accent"
        colorPalette={postcardTemplate.colors}
        activeColor={frontAccentColor}
        onClick={setFrontAccentColor}
      />
      <ColorDropdown
        label="Background"
        colorPalette={postcardTemplate.colors}
        activeColor={frontBackgroundColor}
        onClick={setFrontBackgroundColor}
      />
    </>
  );
};
export default FrontPageToolbar;
