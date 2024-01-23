import { RGBAColor } from '@cesdk/engine';
import classNames from 'classnames';
import { ColorPicker } from 'components/ui/ColorPicker/ColorPicker';
import { hexToRgba, isColorEqual, rgbaToHex } from '../../lib/ColorUtilities';
import Stack from '../../ui/Stack/Stack';
import { caseAssetPath } from '../../util';
import Dropdown from '../Dropdown/Dropdown';
import classes from './ColorDropdown.module.css';

interface ColorDropdownProps {
  label: string;
  onClick: (color: RGBAColor) => void;
  activeColor?: RGBAColor;
  colorPalette?: RGBAColor[];
}

const ColorDropdown = ({
  label,
  onClick,
  activeColor = { r: 0, g: 0, b: 0, a: 1 },
  colorPalette = []
}: ColorDropdownProps) => {
  return (
    <>
      <Dropdown
        label={label}
        Icon={
          <span
            className={classes.colorIcon}
            style={{
              backgroundColor: rgbaToHex(activeColor)
            }}
          />
        }
      >
        {({ onClose }) => (
          <Stack gap="lg">
            {colorPalette.map((color) => (
              <button
                key={rgbaToHex(color)}
                onClick={() => {
                  onClick(color);
                  onClose();
                }}
                style={{ backgroundColor: rgbaToHex(color) }}
                className={classNames(classes.colorButton, {
                  [classes['colorButton--active']]: isColorEqual(
                    color,
                    activeColor
                  )
                })}
              ></button>
            ))}

            <ColorPicker
              name="color-picker"
              positionX="left"
              positionY="bottom"
              onChange={(hex) => {
                if (hex === '#NaNNaNNaN') return;
                try {
                  const color = hexToRgba(hex);
                  onClick(color);
                } catch (e) {}
              }}
              value={rgbaToHex(activeColor)}
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
