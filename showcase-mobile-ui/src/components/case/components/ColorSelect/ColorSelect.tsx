import classNames from 'classnames';
import { HexColorPicker } from 'react-colorful';
import classes from './ColorSelect.module.css';
import { RGBAColor } from '@cesdk/engine';
import { hexToRgba, isColorEqual, rgbaToHex } from '../../lib/ColorUtilities';
import useDebounceCallback from './UseDebounceCallback';
import { useEditor } from '../../EditorContext';

const ALL_COLORS = [
  '#ffffff',
  '#000000',
  '#ff3333',
  '#ffd333',
  '#00d8a4',
  '#335fff'
].map(hexToRgba);

const ColorSelect = ({
  onClick,
  activeColor = ALL_COLORS[0]
}: {
  onClick: (color: RGBAColor) => void;
  activeColor?: RGBAColor;
}) => {
  const { engine } = useEditor();

  const debouncedChangeHandler = useDebounceCallback(() => engine.editor.addUndoStep(), 200);
  const handleChange = (color: string | RGBAColor) => {
    onClick(typeof color === 'string' ? hexToRgba(color) : color);
    debouncedChangeHandler();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.colorPalette}>
        {ALL_COLORS.map((color) => (
          <button
            key={rgbaToHex(color)}
            onClick={() => handleChange(color)}
            style={{ backgroundColor: rgbaToHex(color) }}
            className={classNames(classes.colorButton, {
              [classes['colorButton--active']]: isColorEqual(color, activeColor)
            })}
          ></button>
        ))}
      </div>
      {/* @ts-ignore */}
      <HexColorPicker
        className={classes.colorPicker}
        color={rgbaToHex(activeColor)}
        onChange={handleChange}
      />
    </div>
  );
};
export default ColorSelect;
