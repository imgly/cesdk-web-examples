import { useMemo } from 'react';
import { usePageSettings } from '../../PageSettingsContext';
import ColorDropdown from '../ColorDropdown/ColorDropdown';
import TextFontDropdown from '../TextFontDropdown/TextFontDropdown';
import TextSizeDropdown from '../TextSizeDropdown/TextSizeDropdown';
import { hexToRgba } from '../../lib/ColorUtilities';

const BackPageToolbar = () => {
  const {
    backGreetingsTextFont,
    setBackGreetingsTextFont,
    backGreetingsTextColor,
    setBackGreetingsTextColor,
    backGreetingsTextSize,
    setBackGreetingsTextSize
  } = usePageSettings();

  const palette = useMemo(
    () =>
      ['#263BAA', '#002094', '#001346', '#000514', '#000000'].map(hexToRgba),
    []
  );

  return (
    <>
      <TextFontDropdown
        activeFontPath={backGreetingsTextFont}
        onSelect={setBackGreetingsTextFont}
      />
      <ColorDropdown
        label="Color"
        colorPalette={palette}
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
