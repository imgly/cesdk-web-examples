import { useEditor } from '../../EditorContext';
import classes from './TextColorIcon.module.css';

const TextColorIcon = () => {
  const { selectedTextProperties } = useEditor();

  const [r, g, b] = selectedTextProperties['fill/color'] || [0, 0, 0, 0];

  return (
    <span
      className={classes.icon}
      style={{ backgroundColor: `rgb(${r * 255},${g * 255},${b * 255})` }}
    />
  );
};
export default TextColorIcon;
