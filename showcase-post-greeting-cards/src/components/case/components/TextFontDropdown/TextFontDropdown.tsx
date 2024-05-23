import { Typeface } from '@cesdk/engine';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import FontIcon from '../../icons/Font.svg';
import { useEngine } from '../../lib/EngineContext';
import FontPreview from '../../ui/FontPreview/FontPreview';
import Dropdown from '../Dropdown/Dropdown';
import classes from './TextFontDropdown.module.css';

const FONT_SUBSET = [
  'Caveat',
  'Courier Prime',
  'Archivo',
  'Roboto',
  // Used as font for text inside the apparel scene template:
  'Oswald',
  'Parisienne'
];

interface TextFontDropdownProps {
  onSelect: (typeface: Typeface) => void;
  activeTypeface: Typeface | null;
}

const TextFontDropdown = ({
  onSelect,
  activeTypeface
}: TextFontDropdownProps) => {
  const [typefaces, setTypefaces] = useState<Typeface[]>([]);
  const { engine } = useEngine();

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

  return (
    <Dropdown Icon={<FontIcon />} label="Font">
      {({ onClose }) => (
        <div className={classes.list}>
          {typefaces.map((typeface) => (
            <button
              key={typeface.name}
              className={classNames(classes.button, {
                [classes['button--active']]:
                  activeTypeface?.name === typeface.name
              })}
              onClick={() => {
                onSelect(typeface);
                onClose();
              }}
            >
              <FontPreview typeface={typeface} />
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
};
export default TextFontDropdown;
