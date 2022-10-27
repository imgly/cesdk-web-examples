import classes from './FilterButton.module.css';
import classNames from 'classnames';

const FilterButton = ({ id, thumbUrl, onClick, isActive, label }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={classNames(classes.button, {
        [classes['button--active']]: isActive
      })}
    >
      <img className={classes.image} width={200} alt={`${id}`} src={thumbUrl} />
      <span className={classes.label}>{label}</span>
    </button>
  );
};
export default FilterButton;
