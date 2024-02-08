import React, { ReactElement, useState } from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';

import classes from './StyledPopover.module.css';

interface Props {
  content: ReactElement;
  children: ReactElement;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 200,
  md: 300,
  lg: 400
};

const StyledPopover: React.FC<Props> = ({ content, size = 'sm', children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverActive, setIsPopoverActive] = useState(false);
  if (!children) {
    return <div></div>;
  }
  return (
    <Popover
      isOpen={isPopoverActive || isPopoverOpen}
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
      onClickOutside={() => {
        setIsPopoverOpen(false);
        setIsPopoverActive(false);
      }}
      containerClassName={classes.root}
    >
      {/* @ts-ignore */}
      {React.cloneElement(children, {
        onClick: () => setIsPopoverActive(!isPopoverActive),
        onMouseEnter: () => !isPopoverActive && setIsPopoverOpen(true),
        onMouseLeave: () => !isPopoverActive && setIsPopoverOpen(false)
      })}
    </Popover>
  );
};

export default StyledPopover;
