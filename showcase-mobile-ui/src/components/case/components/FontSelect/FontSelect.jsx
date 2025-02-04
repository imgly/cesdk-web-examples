import classNames from 'classnames';
import { createRef, useEffect, useMemo } from 'react';
import { caseAssetPath } from '../../util';
import ALL_FONTS from './Fonts.json';
import classes from './FontSelect.module.css';

const fullFontPath = (fontPath) => `/extensions/ly.img.cesdk.fonts/${fontPath}`;

const FontSelect = ({ fontFilter = () => true, onSelect, activeFontUri }) => {
  const fonts = useMemo(
    () =>
      ALL_FONTS.filter(fontFilter).map((font) => ({
        ...font,
        ref: createRef(),
        isActive: fullFontPath(font.fontPath) === activeFontUri
      })),
    [fontFilter, activeFontUri]
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
    <div className={classes.wrapper}>
      {fonts.map(({ id, fontPath, fontFamily, isActive, ref }) => {
        return (
          <button
            key={fontPath}
            onClick={() => onSelect(fullFontPath(fontPath))}
            ref={ref}
            className={classNames(classes.button, {
              [classes['button--active']]: isActive
            })}
          >
            <span>
              <img
                src={caseAssetPath(`/font-previews/${id}.png`)}
                width={70}
                height={26}
                alt={fontFamily}
              />
            </span>
            <span>{fontFamily}</span>
          </button>
        );
      })}
    </div>
  );
};
export default FontSelect;
