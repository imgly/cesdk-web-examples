import classes from './AdjustmentButton.module.css';
import classNames from 'classnames';

const AdjustmentButton = ({ id, label, onClick, isActive }) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className={classNames(classes.button, {
        [classes['button--active']]: isActive
      })}
    >
      {label}
    </button>
  );
};
export default AdjustmentButton;
