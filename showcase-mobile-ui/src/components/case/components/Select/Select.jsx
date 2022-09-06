import classes from './Select.module.css';

const Select = ({ children, onChange, ...rest }) => {
  return (
    <select
      className={classes.select}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...rest}
    >
      {children}
    </select>
  );
};
export default Select;
