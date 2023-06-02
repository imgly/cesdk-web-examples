import React, { ReactElement, useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';

import classes from './StyledPopover.module.css';

interface Props {
  content: ReactElement;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 200,
  md: 300,
  lg: 400
};

const StyledPopover: React.FC<Props> = ({ content, size = 'sm', children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  if (!children) {
    return <div></div>;
  }
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['top', 'bottom', 'left', 'right']}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          style={{ padding: '12px' }}
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={'#000000'}
          arrowSize={16}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div style={{ width: SIZE_MAP[size] }} className={classes.popover}>
            {content}
          </div>
        </ArrowContainer>
      )}
      onClickOutside={() => setIsPopoverOpen(false)}
      containerClassName={classes.root}
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
