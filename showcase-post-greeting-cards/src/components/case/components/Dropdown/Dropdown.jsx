import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { useEditor } from '../../EditorContext';
import classes from './Dropdown.module.css';

const Dropdown = ({ children, label, Icon }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { creativeEngine } = useEditor();

  useEffect(() => {
    const touchHandler = (e) => {
      setIsPopoverOpen(false);
    };
    const canvasElement = creativeEngine.element;
    canvasElement.addEventListener('touchstart', touchHandler);
    return () => {
      canvasElement.removeEventListener('touchstart', touchHandler);
    };
  }, [creativeEngine.element]);

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
