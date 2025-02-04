import classes from './DockMenu.module.css';

const DockMenu = ({ children, ...rest }) => {
  return (
    <div className={classes.dock} {...rest}>
      {children}
    </div>
  );
};

export default DockMenu;
