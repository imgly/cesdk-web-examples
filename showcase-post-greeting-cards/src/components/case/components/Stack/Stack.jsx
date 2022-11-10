import classNames from 'classnames';
import classes from './Stack.module.css';

const Stack = ({ children, gap = 'md', className, ...rest }) => {
  return (
    <div
      className={classNames(
        className,
        classes.stack,
        classes['stack--gap-' + gap]
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Stack;
