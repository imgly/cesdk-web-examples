import React, { FunctionComponent, ReactElement, useState } from 'react';
import { Popover } from 'react-tiny-popover';

interface IStyledPopover {
  content: ReactElement;
}

const StyledPopover: FunctionComponent<IStyledPopover> = ({
  children,
  content
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  if (!children) {
    return <div></div>;
  }
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
      content={content}
      onClickOutside={() => setIsPopoverOpen(false)}
    >
      {/* @ts-ignore */}
      {React.cloneElement(children, {
        onMouseEnter: () => setIsPopoverOpen(true),
        onMouseLeave: () => setIsPopoverOpen(false)
      })}
    </Popover>
  );
};

export default StyledPopover;
