import { usePageSettings } from '../../PageSettingsContext';
import ColorDropdown from '../ColorDropdown/ColorDropdown';
import TextFontDropdown from '../TextFontDropdown/TextFontDropdown';
import TextSizeDropdown from '../TextSizeDropdown/TextSizeDropdown';

const BackPageToolbar = () => {
  const {
    backGreetingsTextFont,
    setBackGreetingsTextFont,
    backGreetingsTextColor,
    setBackGreetingsTextColor,
    backGreetingsTextSize,
    setBackGreetingsTextSize
  } = usePageSettings();

  return (
    <>
      <TextFontDropdown
        activeFontPath={backGreetingsTextFont}
        onSelect={setBackGreetingsTextFont}
      />
      <ColorDropdown
        label="Color"
        colorPalette={['#263BAA', '#002094', '#001346', '#000514', '#000000']}
        activeColor={backGreetingsTextColor}
        onClick={setBackGreetingsTextColor}
      />
      <TextSizeDropdown
        activeTextSize={backGreetingsTextSize}
        onSelect={setBackGreetingsTextSize}
      />
    </>
  );
};
export default BackPageToolbar;
