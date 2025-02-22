import { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import classes from './Dropdown.module.css';
import { useEngine } from '../../lib/EngineContext';

interface DropdownProps {
  children: (props: { onClose: () => void }) => React.ReactNode;
  label: string;
  Icon: React.ReactNode;
}

const Dropdown = ({ children, label, Icon }: DropdownProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { engine } = useEngine();

  useEffect(() => {
    const touchHandler = () => {
      setIsPopoverOpen(false);
    };
    const canvasElement = engine.element!;
    canvasElement.addEventListener('touchstart', touchHandler);
    return () => {
      canvasElement.removeEventListener('touchstart', touchHandler);
    };
  }, [engine.element]);

  return (
    <>
      {/* @ts-ignore */}
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
