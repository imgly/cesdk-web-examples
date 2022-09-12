import { capitalize } from 'lodash';
import Select from '../Select/Select';
import STICKERS from './stickers.json';
const StickerSelectFilter = ({ onChange }) => {
  const availableGroups = Object.keys(STICKERS);
  return (
    <Select onChange={onChange}>
      <option value="">All</option>
      {availableGroups.map((group) => (
        <option value={group} key={group}>
          {capitalize(group)}
        </option>
      ))}
    </Select>
  );
};
export default StickerSelectFilter;
