import classNames from 'classnames';
import classes from './Stack.module.css';

interface StackProps {
  children: React.ReactNode;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Stack = ({ children, gap = 'md', className, ...rest }: StackProps) => {
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
