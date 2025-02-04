import classNames from 'classnames';
import { HexColorPicker } from 'react-colorful';
import classes from './ColorSelect.module.css';

const ALL_COLORS = [
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 51, b: 51 },
  { r: 255, g: 211, b: 51 },
  { r: 0, g: 216, b: 164 },
  { r: 51, g: 95, b: 255 }
];

const normalizeColors = ({ r, g, b }) => ({
  r: r / 255,
  g: g / 255,
  b: b / 255
});

const denormalizeColors = ({ r, g, b }) => ({
  r: r * 255,
  g: g * 255,
  b: b * 255
});

const rgbToHex = ({ r, g, b }) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

const PRECISION = 0.001;
const isColorEqual = (colorA, colorB) => {
  return (
    Math.abs(colorB.r - colorA.r) < PRECISION &&
    Math.abs(colorB.g - colorA.g) < PRECISION &&
    Math.abs(colorB.b - colorA.b) < PRECISION
  );
};
const RGBAArrayToObj = ([r, g, b, _a]) => ({ r, g, b });

const ColorSelect = ({ onClick, activeColor }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.colorPalette}>
        {ALL_COLORS.map(({ r, g, b }) => (
          <button
            key={JSON.stringify({ r, g, b })}
            onClick={() => onClick(normalizeColors({ r, g, b }))}
            style={{ backgroundColor: `rgb(${r},${g},${b})` }}
            className={classNames(classes.colorButton, {
              [classes['colorButton--active']]: isColorEqual(
                normalizeColors({ r, g, b }),
                RGBAArrayToObj(activeColor ?? [0, 0, 0, 1])
              )
            })}
          ></button>
        ))}
      </div>
      <HexColorPicker
        className={classes.colorPicker}
        color={rgbToHex(
          denormalizeColors(RGBAArrayToObj(activeColor ?? [0, 0, 0, 1]))
        )}
        onChange={(colorHex) => onClick(normalizeColors(hexToRgb(colorHex)))}
      />
    </div>
  );
};
export default ColorSelect;
