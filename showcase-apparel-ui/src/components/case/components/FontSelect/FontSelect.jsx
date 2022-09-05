import { createRef, useEffect, useMemo } from 'react';
import { caseAssetPath } from '../../util';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';
import ALL_FONTS from './Fonts.json';

const fullFontPath = (fontPath) => `/extensions/ly.img.cesdk.fonts/${fontPath}`;

const FontSelect = ({ onSelect, activeFontUri }) => {
  const fonts = useMemo(
    () =>
      ALL_FONTS.map((font) => ({
        ...font,
        ref: createRef(),
        isActive: fullFontPath(font.fontPath) === activeFontUri
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
      {fonts.map(({ id, fontPath, fontFamily, isActive, ref }) => {
        return (
          <AdjustmentsBarButton
            key={fontPath}
            isActive={isActive}
            onClick={() => onSelect(fullFontPath(fontPath))}
            ref={ref}
          >
            <span>
              <img
                src={caseAssetPath(`/font-previews/${id}.png`)}
                width={24}
                height={24}
                alt={fontFamily}
              />
            </span>
            <span>{fontFamily}</span>
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default FontSelect;
