import { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import classes from './Dropdown.module.css';

const Dropdown = ({ children, label, Icon }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        positions={['bottom', 'left', 'right', 'top']}
        content={
          <div className={classes.popover}>
            {children({ onClose: () => setIsPopoverOpen(false) })}
          </div>
        }
        onClickOutside={() => setIsPopoverOpen(false)}
      >
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className={classes.button}
        >
          {Icon}
          {label}
        </button>
      </Popover>
    </>
  );
};
export default Dropdown;
