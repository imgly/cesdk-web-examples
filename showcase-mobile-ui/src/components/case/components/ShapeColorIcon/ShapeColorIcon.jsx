import { useEditor } from '../../EditorContext';
import classes from './ShapeColorIcon.module.css';

const ShapeColorIcon = () => {
  const { selectedShapeProperties } = useEditor();

  const [r, g, b] = selectedShapeProperties['fill/solid/color'] || [0, 0, 0, 0];

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
};
export default ShapeColorIcon;
