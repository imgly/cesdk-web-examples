import { createRef, useEffect, useMemo, useState } from 'react';
import FontPreview from '../FontPreview/FontPreview';
import { useEditor } from '../../EditorContext';
import classes from './FontSelect.module.css';
import classNames from 'classnames';

const FONT_SUBSET = [
  'Caveat',
  'Courier Prime',
  'Roboto',
  'Oswald',
  'Parisienne',
  'Manrope'
];

const SCROLL_INTO_VIEW_ENABLED = false;

const FontSelect = ({ onSelect, activeTypeface }) => {
  const { engine } = useEditor();
  const [typefaces, setTypefaces] = useState([]);

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
          .map((asset) => asset.payload.typeface)
          .filter((typeface) => FONT_SUBSET.includes(typeface.name))
      );
    }
    fetchFonts();
  }, [engine]);

  const typefacesWithRef = useMemo(
    () =>
      typefaces.map((typeface) => ({
        typeface,
        ref: createRef(),
        isActive: activeTypeface?.name === typeface.name
      })),
    [activeTypeface, typefaces]
  );
  const activeFont = useMemo(
    () => typefacesWithRef.find(({ isActive }) => isActive),
    [typefacesWithRef]
  );

  useEffect(() => {
    if (
      typefaces.length == 0 ||
      !activeFont ||
      !activeFont.ref.current ||
      !SCROLL_INTO_VIEW_ENABLED
    ) {
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
    <div className={classes.wrapper}>
      {typefacesWithRef.map(({ typeface, isActive, ref }) => {
        return (
          <button
            key={typeface.name}
            onClick={() =>
              onSelect(
                typeface.fonts.find(
                  (font) => font.weight === 'normal' && font.style === 'normal'
                ) ?? typeface.fonts[0],
                typeface
              )
            }
            ref={ref}
            className={classNames(classes.button, {
              [classes['button--active']]: isActive
            })}
          >
            <FontPreview text="Ag" typeface={typeface} />
            <span>{typeface.name}</span>
          </button>
        );
      })}
    </div>
  );
};
export default FontSelect;
