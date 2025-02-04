import classNames from 'classnames';
import classes from './AdjustmentsBar.module.css';

const AdjustmentsBar = ({ children, gap = 'md' }) => {
  return (
    <div className={classes.wrapper}>
      <div
        className={classNames(
          classes.innerWrapper,
          classes[`innerWrapper--gap-${gap}`]
        )}
      >
        {children}
      </div>
    </div>
  );
};
export default AdjustmentsBar;
