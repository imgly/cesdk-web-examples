import AdjustmentsBar from '../../ui/AdjustmentsBar/AdjustmentsBar';
import { caseAssetPath } from '../../util';
import classes from './ThemeBar.module.css';

export const ALL_THEMES = [
  {
    id: 'jungle',
    defaultBGColor: '#008625',
    defaultTypeface: 'Aleo'
  },
  {
    id: 'sea',
    defaultBGColor: '#0027BC',
    defaultTypeface: 'Coiny'
  },
  {
    id: 'savanna',
    defaultBGColor: '#E2701D',
    defaultTypeface: 'Trash Hand'
  },
  {
    id: 'castle',
    defaultBGColor: '#DC1876',
    defaultTypeface: 'Elsie Swash Caps'
  }
].map(({ id, ...rest }) => ({
  id: id,
  label: `${id} Theme`,
  asset: {
    light: caseAssetPath(`/themes/${id}-bg-light.svg`),
    dark: caseAssetPath(`/themes/${id}-bg-dark.svg`),
    ...rest
  },
  Thumb: (
    <img src={caseAssetPath(`/themes/${id}-preview.png`)} alt={`${id} Theme`} />
  )
}));

const ThemeBar = ({ onClick }) => {
  return (
    <AdjustmentsBar gap="md">
      {ALL_THEMES.map(({ id, Thumb, asset }) => (
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
