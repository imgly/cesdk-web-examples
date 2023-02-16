import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import { useProperty } from '../../lib/UseSelectedProperty';
import classes from './BackgroundColorIcon.module.css';

const BackgroundColorIcon = () => {
  const { currentPageBlockId } = useSinglePageMode();
  const [shapeColor] = useProperty(currentPageBlockId, 'fill/solid/color');
  const [r, g, b] = shapeColor ?? [0, 0, 0];
  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
};
export default BackgroundColorIcon;
