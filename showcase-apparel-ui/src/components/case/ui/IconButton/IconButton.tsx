import classNames from 'classnames';
import classes from './IconButton.module.css';

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children?: React.ReactNode;
  isActive?: boolean;
  iconColor?: string;
  onClick?: () => void;
}

const IconButton = ({
  icon,
  children,
  isActive,
  iconColor,
  onClick,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      className={classNames(classes.wrapper, {
        [classes['wrapper--active']]: isActive
      })}
      onClick={onClick}
      {...rest}
    >
      <span className={classes.iconWrapper} style={{ color: iconColor }}>
        {icon}
      </span>
      {children && <span className={classes.label}>{children}</span>}
    </button>
  );
};
export default IconButton;
