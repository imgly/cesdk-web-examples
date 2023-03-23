import { caseAssetPath } from '../../util';

import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import classes from './ThemeBar.module.css';

export const ALL_THEMES = [
  {
    id: 'jungle',
    defaultBGColor: '#008625',
    defaultFontFileUri:
      'extensions/ly.img.cesdk.fonts/fonts/imgly_font_aleo_bold.otf'
  },
  {
    id: 'sea',
    defaultBGColor: '#0027BC',
    defaultFontFileUri:
      'extensions/ly.img.cesdk.fonts/fonts/Coiny/Coiny-Regular.ttf'
  },
  {
    id: 'savanna',
    defaultBGColor: '#E2701D',
    defaultFontFileUri:
      'extensions/ly.img.cesdk.fonts/fonts/imgly_font_trash_hand.ttf'
  },
  {
    id: 'castle',
    defaultBGColor: '#DC1876',
    defaultFontFileUri:
      'extensions/ly.img.cesdk.fonts/fonts/ElsieSwashCaps/ElsieSwashCaps-Regular.ttf'
  }
].map(({ id, defaultBGColor, defaultFontFileUri }) => ({
  id: id,
  label: `${id} Theme`,
  asset: {
    light: caseAssetPath(`/themes/${id}-bg-light.svg`),
    dark: caseAssetPath(`/themes/${id}-bg-dark.svg`),
    defaultBGColor,
    defaultFontFileUri
  },
  Thumb: (
    <img src={caseAssetPath(`/themes/${id}-preview.png`)} alt={`${id} Theme`} />
  )
}));

const ThemeBar = ({ onClick }) => {
  return (
    <AdjustmentsBar gap="md">
      {ALL_THEMES.map(({ id, Thumb, type, thumbUri, asset }) => (
        <button
          className={classes.button}
          key={id}
          onClick={() => onClick(asset)}
        >
          {Thumb}
        </button>
      ))}
    </AdjustmentsBar>
  );
};
export default ThemeBar;
