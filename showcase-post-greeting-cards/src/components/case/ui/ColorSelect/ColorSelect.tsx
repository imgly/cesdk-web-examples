import { RGBAColor } from '@cesdk/engine';
import classNames from 'classnames';
import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
import { hexToRgba, isColorEqual, rgbaToHex } from '../../lib/ColorUtilities';
import { caseAssetPath } from '../../util';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import classes from './ColorSelect.module.css';

interface ColorSelectProps {
  colorPalette: Array<RGBAColor>;
  onClick: (color: RGBAColor) => void;
  activeColor?: RGBAColor;
}

const ColorSelect = ({
  colorPalette,
  onClick,
  activeColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  }
}: ColorSelectProps) => {
  return (
    // Resetting the overflow property to allow the ColorPicker to flow out of the boundings of the AdjustmentsBar.
    // Scrolling is not needed for in the ColorSelect Bar.

    <AdjustmentsBar gap="md" style={{ overflow: 'initial' }}>
      {colorPalette.map((color) => (
        <button
          key={rgbaToHex(color)}
          onClick={() => onClick(color)}
          style={{
            backgroundColor: rgbaToHex(color)
          }}
          className={classNames(classes.colorButton, {
            [classes['colorButton--active']]: isColorEqual(color, activeColor)
          })}
        ></button>
      ))}
      <ColorPicker
        name="color-picker"
        positionX="left"
        positionY="top"
        onChange={(hex) => {
          if (hex === '#NaNNaNNaN') return;
          try {
            const color = hexToRgba(hex);
            onClick(color);
          } catch (e) {}
        }}
        value={rgbaToHex(activeColor)}
      >
        <button className={classes.colorButton}>
          <img src={caseAssetPath('/ColorPicker.png')} alt={'Pick color'} />
        </button>
      </ColorPicker>
    </AdjustmentsBar>
  );
};
export default ColorSelect;
