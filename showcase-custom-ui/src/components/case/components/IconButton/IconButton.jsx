import classNames from 'classnames';
import classes from './IconButton.module.css';

const IconButton = ({ icon, children, isActive, iconColor, onClick }) => {
  return (
    <button
      className={classNames(classes.wrapper, {
        [classes['wrapper--active']]: isActive
      })}
      onClick={onClick}
    >
      <span className={classes.iconWrapper} style={{ color: iconColor }}>
        {icon}
      </span>
      {children && <span>{children}</span>}
    </button>
  );
};
export default IconButton;
