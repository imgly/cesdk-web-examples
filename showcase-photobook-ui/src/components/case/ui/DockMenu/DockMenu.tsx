import classes from './DockMenu.module.css';

interface DockMenuProps {
  children: React.ReactNode;
}

const DockMenu = ({ children, ...rest }: DockMenuProps) => {
  return (
    <div className={classes.dock} {...rest}>
      {children}
    </div>
  );
};

export default DockMenu;
