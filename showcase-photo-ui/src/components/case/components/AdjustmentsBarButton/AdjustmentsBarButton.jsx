import classNames from 'classnames';
import { forwardRef } from 'react';
import classes from './AdjustmentsBarButton.module.css';

const AdjustmentsBarButton = forwardRef(
  ({ children, isActive, iconColor, onClick }, ref) => {
    return (
      <button
        className={classNames(classes.wrapper, {
          [classes['wrapper--active']]: isActive
        })}
        onClick={onClick}
        style={{ color: iconColor }}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

AdjustmentsBarButton.displayName = 'AdjustmentsBarButton';
export default AdjustmentsBarButton;
