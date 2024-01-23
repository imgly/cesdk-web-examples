import classes from './DockMenuGroup.module.css';

interface DockMenuGroupProps {
  children: React.ReactNode;
}

const DockMenuGroup = ({ children, ...rest }: DockMenuGroupProps) => {
  return (
    <div className={classes.group} {...rest}>
      {children}
    </div>
  );
};

export default DockMenuGroup;
