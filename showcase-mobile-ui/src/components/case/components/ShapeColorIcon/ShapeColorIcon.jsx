import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import classes from './ShapeColorIcon.module.css';

const ShapeColorIcon = () => {
  const [fillColor] = useSelectedProperty('fill/solid/color');
  const [r, g, b] = fillColor;

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
};
export default ShapeColorIcon;
