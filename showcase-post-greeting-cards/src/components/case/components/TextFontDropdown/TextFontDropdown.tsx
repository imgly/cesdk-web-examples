import classNames from 'classnames';
import { ReactComponent as FontIcon } from '../../icons/Font.svg';
import Dropdown from '../Dropdown/Dropdown';
import FontPreview from '../../ui/FontPreview/FontPreview';
import ALL_FONTS from '../../ui/FontSelect/Fonts.json';
import classes from './TextFontDropdown.module.css';

interface TextFontDropdownProps {
  onSelect: (fontPath: string) => void;
  activeFontPath: string;
}

const TextFontDropdown = ({
  onSelect,
  activeFontPath
}: TextFontDropdownProps) => {
  return (
    <Dropdown Icon={<FontIcon />} label="Font">
      {({ onClose }) => (
        <div className={classes.list}>
          {ALL_FONTS.map((font) => (
            <button
              key={font.id}
              className={classNames(classes.button, {
                [classes['button--active']]: activeFontPath === font.fontPath
              })}
              onClick={() => {
                onSelect(font.fontPath);
                onClose();
              }}
            >
              <FontPreview font={font} />
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
};
export default TextFontDropdown;
