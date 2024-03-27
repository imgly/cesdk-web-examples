import { createRef, useEffect, useMemo } from 'react';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';
import FontPreview from '../FontPreview/FontPreview';
import ALL_FONTS from './Fonts.json';

interface FontSelectProps {
  onSelect: (fontPath: string) => void;
  activeFontUri?: string;
}

const FontSelect = ({ onSelect, activeFontUri }: FontSelectProps) => {
  const fonts = useMemo(
    () =>
      ALL_FONTS.map((font) => ({
        ...font,
        ref: createRef<
          HTMLButtonElement & {
            scrollIntoView: (options?: boolean | ScrollIntoViewOptions) => void;
          }
        >(),
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
            key={id}
            isActive={isActive}
            onClick={() => onSelect(fontPath)}
            ref={ref}
          >
            <FontPreview
              text="Ag"
              font={{ fontPath, fontFamily, fontWeight }}
            />
            <span>{fontFamily}</span>
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default FontSelect;
