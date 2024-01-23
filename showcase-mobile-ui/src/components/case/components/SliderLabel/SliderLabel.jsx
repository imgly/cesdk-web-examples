import classes from './SliderLabel.module.css';

const SliderLabel = ({ label, children }) => {
  return (
    <div className={classes.wrapper}>
      <span className={classes.label}>{label}</span>
      {children}
    </div>
  );
};
export default SliderLabel;
