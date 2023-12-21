import classNames from 'classnames';
import { useToolbarHeight } from '../UseToolbarHeight/UseToolbarHeight';
import classes from './AdjustmentsBar.module.css';

interface AdjustmentsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
}

const AdjustmentsBar = ({
  children,
  gap = 'md',
  ...rest
}: AdjustmentsBarProps) => {
  const { ref } = useToolbarHeight();
  return (
    <div className={classes.wrapper} {...rest} ref={ref}>
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
