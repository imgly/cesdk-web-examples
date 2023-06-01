import classNames from 'classnames';
import { ColorPicker } from 'components/ui/ColorPicker/ColorPicker';
import {
  denormalizeColors,
  hexToRgb,
  isColorEqual,
  normalizeColors,
  rgbToHex
} from '../../lib/CreativeEngineUtils';
import { caseAssetPath } from '../../util';
import Dropdown from '../Dropdown/Dropdown';
import Stack from '../Stack/Stack';
import classes from './ColorDropdown.module.css';

const ColorDropdown = ({ label, onClick, activeColor, colorPalette = [] }) => {
  const denormalizedActiveColor = activeColor
    ? denormalizeColors(activeColor)
    : { r: 0, g: 0, b: 0 };
  return (
    <>
      <Dropdown
        label={label}
        Icon={
          <span
            className={classes.colorIcon}
            style={{
              backgroundColor: `rgb(${denormalizedActiveColor?.r},${denormalizedActiveColor?.g},${denormalizedActiveColor?.b})`
            }}
          />
        }
      >
        {({ onClose }) => (
          <Stack gap="lg">
            {colorPalette
              .map((color) =>
                typeof color === 'string' ? hexToRgb(color) : color
              )
              .map(({ r, g, b }) => (
                <button
                  key={JSON.stringify({ r, g, b })}
                  onClick={() => {
                    onClick(normalizeColors({ r, g, b }));
                    onClose();
                  }}
                  style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                  className={classNames(classes.colorButton, {
                    [classes['colorButton--active']]: isColorEqual(
                      normalizeColors({ r, g, b }),
                      activeColor ?? { r: 0, g: 0, b: 0 }
                    )
                  })}
                ></button>
              ))}

            <ColorPicker
              positionX="left"
              positionY="bottom"
              onChange={(hexColor) =>
                onClick(normalizeColors(hexToRgb(hexColor)))
              }
              value={rgbToHex(
                denormalizedActiveColor.r,
                denormalizedActiveColor.g,
                denormalizedActiveColor.b
              )}
            >
              <button className={classNames(classes.colorButton)}>
                <img
                  src={caseAssetPath('/ColorPicker.png')}
                  alt={'Pick color'}
                />
              </button>
            </ColorPicker>
          </Stack>
        )}
      </Dropdown>
    </>
  );
};
export default ColorDropdown;
