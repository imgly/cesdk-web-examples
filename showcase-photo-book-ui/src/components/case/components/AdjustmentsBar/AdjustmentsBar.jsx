import classNames from 'classnames';
import classes from './AdjustmentsBar.module.css';

const AdjustmentsBar = ({ children, gap = 'md', ...rest }) => {
  return (
    <div className={classes.wrapper} {...rest}>
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
