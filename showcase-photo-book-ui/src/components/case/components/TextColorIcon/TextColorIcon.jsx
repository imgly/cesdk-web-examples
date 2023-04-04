import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import classes from './TextColorIcon.module.css';

const TextColorIcon = () => {
  const [textColor] = useSelectedProperty('fill/solid/color');
  const [r, g, b] = textColor;

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
};
export default TextColorIcon;
