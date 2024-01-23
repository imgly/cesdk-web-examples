import classNames from 'classnames';
import classes from './AdjustmentsBar.module.css';

const AdjustmentsBar = ({ children, scroll = 'auto', gap = 'md' }) => {
  return (
    <div className={classes.wrapper} style={{ overflowX: scroll }}>
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
