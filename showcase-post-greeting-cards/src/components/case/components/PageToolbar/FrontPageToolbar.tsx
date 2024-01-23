import { useEditor } from '../../EditorContext';
import { usePageSettings } from '../../PageSettingsContext';
import { hexToRgba } from '../../lib/ColorUtilities';
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
        colorPalette={postcardTemplate.colors.map(hexToRgba)}
        activeColor={frontAccentColor}
        onClick={setFrontAccentColor}
      />
      <ColorDropdown
        label="Background"
        colorPalette={postcardTemplate.colors.map(hexToRgba)}
        activeColor={frontBackgroundColor}
        onClick={setFrontBackgroundColor}
      />
    </>
  );
};
export default FrontPageToolbar;
