import Select from '../Select/Select';
import { useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';

const LABELS = {
  '//ly.img.cesdk.stickers.doodle/category/doodle': 'Doodle',
  '//ly.img.cesdk.stickers.emoji/category/emoji': 'Emoji',
  '//ly.img.cesdk.stickers.emoticons/category/emoticons': 'Emoticons',
  '//ly.img.cesdk.stickers.hand/category/hand': 'Hands',
  '//ly.img.cesdk.stickers/category/stickers': 'Stickers'
};

const StickerSelectFilter = ({ onChange }) => {
  const { engine } = useEditor();
  const [availableGroups, setAvailableGroups] = useState([]);
  useEffect(() => {
    const loadGroups = async () => {
      const newGroups = await engine.asset.getGroups('ly.img.sticker');
      setAvailableGroups(newGroups);
    };
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select onChange={onChange}>
      <option value="">All</option>
      {availableGroups.map((group) => (
        <option value={group} key={group}>
          {LABELS[group]}
        </option>
      ))}
    </Select>
  );
};
export default StickerSelectFilter;
