import classNames from 'classnames';
import { ColorPicker } from 'components/ui/ColorPicker/ColorPicker';
import {
  denormalizeColors,
  hexToRgb,
  isColorEqual,
  normalizeColors,
  RGBAArrayToObj,
  rgbToHex
} from '../../lib/CreativeEngineUtils';
import { caseAssetPath } from '../../util';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import classes from './ColorSelect.module.css';

const ColorSelect = ({
  colorPalette,
  onClick,
  onClickDebounced,
  activeColor
}) => {
  const denormalizedActiveColor = activeColor
    ? denormalizeColors(RGBAArrayToObj(activeColor))
    : { r: 0, g: 0, b: 0 };
  return (
    // Resetting the overflow property to allow the ColorPicker to flow out of the boundings of the AdjustmentsBar.
    // Scrolling is not needed for in the ColorSelect Bar.
    <AdjustmentsBar gap="md" style={{ overflow: 'initial' }}>
      {colorPalette.map(({ r, g, b }) => (
        <button
          key={JSON.stringify({ r, g, b })}
          onClick={() => {
            onClick(normalizeColors({ r, g, b }));
            // We do not need to actually debounce the callback, but we need to trigger it.
            onClickDebounced();
          }}
          style={{ backgroundColor: `rgb(${r},${g},${b})` }}
          className={classNames(classes.colorButton, {
            [classes['colorButton--active']]: isColorEqual(
              normalizeColors({ r, g, b }),
              RGBAArrayToObj(activeColor ?? [0, 0, 0, 1])
            )
          })}
        ></button>
      ))}
      <ColorPicker
        positionX="left"
        positionY="top"
        onChange={(hexColor) => onClick(normalizeColors(hexToRgb(hexColor)))}
        onChangeDebounced={onClickDebounced}
        value={rgbToHex(
          denormalizedActiveColor.r,
          denormalizedActiveColor.g,
          denormalizedActiveColor.b
        )}
      >
        <button className={classes.colorButton}>
          <img src={caseAssetPath('/ColorPicker.png')} alt={'Pick color'} />
        </button>
      </ColorPicker>
    </AdjustmentsBar>
  );
};
export default ColorSelect;
