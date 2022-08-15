import { capitalize } from 'lodash';
import Select from '../Select/Select';
import ALL_FONTS from './Fonts.json';

const FONT_GROUPS = [
  ...new Set(ALL_FONTS.map(({ group }) => group).filter((v) => v))
];

const FontSelectFilter = ({ onChange }) => {
  return (
    <Select onChange={onChange}>
      <option value="">All</option>
      {FONT_GROUPS.map((group) => (
        <option value={group} key={group}>
          {capitalize(group)}
        </option>
      ))}
    </Select>
  );
};
export default FontSelectFilter;
