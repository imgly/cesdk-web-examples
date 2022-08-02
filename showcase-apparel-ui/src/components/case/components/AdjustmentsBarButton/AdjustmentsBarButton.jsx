import classNames from 'classnames';
import classes from './AdjustmentsBarButton.module.css';

const AdjustmentsBarButton = ({ children, isActive, iconColor, onClick }) => {
  return (
    <button
      className={classNames(classes.wrapper, {
        [classes['wrapper--active']]: isActive
      })}
      onClick={onClick}
      style={{ color: iconColor }}
    >
      {children}
    </button>
  );
};
export default AdjustmentsBarButton;
