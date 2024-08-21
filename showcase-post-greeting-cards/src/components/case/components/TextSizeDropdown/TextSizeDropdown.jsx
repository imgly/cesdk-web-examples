import classNames from 'classnames';
import { ReactComponent as TextSizeIcon } from '../../icons/TextSize.svg';
import Dropdown from '../Dropdown/Dropdown';
import classes from './TextSizeDropdown.module.css';

const ALL_TEXT_SIZES = { S: 14, M: 18, L: 22 };

const TextSizeDropdown = ({ onSelect, activeTextSize }) => {
  return (
    <Dropdown Icon={<TextSizeIcon />} label="Size">
      {({ onClose }) => (
        <ul className={classes.list}>
          {Object.entries(ALL_TEXT_SIZES).map(([label, size]) => (
            <li key={label}>
              <button
                onClick={() => {
                  onSelect(size);
                  onClose();
                }}
                className={classNames(classes.item, {
                  [classes['item--active']]: activeTextSize === size
                })}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
};
export default TextSizeDropdown;
