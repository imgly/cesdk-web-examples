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
      <span
        className="flex items-center justify-center"
        style={{ color: iconColor, maxHeight: '100%' }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </button>
  );
};
export default IconButton;
