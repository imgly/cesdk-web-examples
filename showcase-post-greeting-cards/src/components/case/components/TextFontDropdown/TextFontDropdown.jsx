import classNames from 'classnames';
import { ReactComponent as FontIcon } from '../../icons/Font.svg';
import Dropdown from '../Dropdown/Dropdown';
import FontPreview from '../FontPreview/FontPreview';
import ALL_FONTS from '../FontSelect/Fonts.json';
import classes from './TextFontDropdown.module.css';

const TextFontDropdown = ({ onSelect, activeFontPath }) => {
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
