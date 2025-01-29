import { Font, Typeface } from '@cesdk/engine';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useEngine } from '../../lib/EngineContext';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';
import FontPreview from '../FontPreview/FontPreview';

const FONT_SUBSET = [
  'Caveat',
  'Courier Prime',
  'Archivo',
  'Roboto',
  'Oswald',
  'Parisienne',
  'Amatic SC',
  'Lobster Two',
  'Nixie One',
  'Quicksand',
  'Abril Fatface',
  'Yeseva One',
  'Notable'
];

interface FontSelectProps {
  onSelect: (font: Font, typeface: Typeface) => void;
  activeTypeface?: Typeface;
}

const FontSelect = ({ onSelect, activeTypeface }: FontSelectProps) => {
  const { engine } = useEngine();
  const [typefaces, setTypefaces] = useState<Typeface[]>([]);

  useEffect(() => {
    async function fetchFonts() {
      const typefaceAssetResults = await engine.asset.findAssets(
        'ly.img.typeface',
        {
          page: 0,
          perPage: 100,
          query: ''
        }
      );

      setTypefaces(
        typefaceAssetResults.assets
          .map((asset) => asset.payload!.typeface!)
          .filter((typeface) => FONT_SUBSET.includes(typeface.name))
      );
    }
    fetchFonts();
  }, [engine]);

  const typefacesWithRef = useMemo<
    {
      typeface: Typeface;
      ref: React.RefObject<HTMLButtonElement | null>;
      isActive: boolean;
    }[]
  >(
    () =>
      typefaces.map((typeface) => ({
        typeface,
        ref: createRef<
          HTMLButtonElement & {
            scrollIntoView: (options?: boolean | ScrollIntoViewOptions) => void;
          }
        >(),
        isActive: activeTypeface?.name === typeface.name
      })),
    [activeTypeface, typefaces]
  );
  const activeFont = useMemo(
    () => typefacesWithRef.find(({ isActive }) => isActive),
    [typefacesWithRef]
  );

  useEffect(() => {
    if (typefaces.length == 0 || !activeFont || !activeFont.ref.current) {
      return;
    }
    activeFont.ref.current.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });

    // Only scroll into view when opening, not when changing the active font
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typefaces]);

  return (
    <AdjustmentsBar>
      {typefacesWithRef.map(({ typeface, isActive, ref }) => {
        return (
          <AdjustmentsBarButton
            key={typeface.name}
            isActive={isActive}
            onClick={() =>
              onSelect(
                typeface.fonts.find(
                  (font) => font.weight === 'normal' && font.style === 'normal'
                ) ?? typeface.fonts[0],
                typeface
              )
            }
            ref={ref}
          >
            <FontPreview text="Ag" typeface={typeface} />
            <span>{typeface.name}</span>
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default FontSelect;
