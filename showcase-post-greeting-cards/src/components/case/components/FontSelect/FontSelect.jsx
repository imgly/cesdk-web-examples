import { createRef, useEffect, useMemo } from 'react';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';
import FontPreview from '../FontPreview/FontPreview';
import ALL_FONTS from './Fonts.json';

const FontSelect = ({ onSelect, activeFontUri }) => {
  const fonts = useMemo(
    () =>
      ALL_FONTS.map((font) => ({
        ...font,
        ref: createRef(),
        isActive: font.fontPath === activeFontUri
      })),
    [activeFontUri]
  );
  const activeFont = useMemo(
    () => fonts.find(({ isActive }) => isActive),
    [fonts]
  );
  useEffect(() => {
    if (activeFont && activeFont.ref.current) {
      activeFont.ref.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    }
    // Only scroll into view when opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdjustmentsBar>
      {fonts.map(({ id, fontWeight, fontPath, fontFamily, isActive, ref }) => {
        return (
          <AdjustmentsBarButton
            key={fontPath}
            isActive={isActive}
            onClick={() => onSelect(fontPath)}
            ref={ref}
          >
            <FontPreview
              text="Ag"
              font={{ fontPath, fontFamily, id, fontWeight }}
            />
            <span>{fontFamily}</span>
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default FontSelect;
