import classes from './StickerSelect.module.css';

import { useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';

const StickerSelect = ({ group, onClick }) => {
  const {
    customEngine: { queryStickers }
  } = useEditor();
  const [stickers, setStickers] = useState([]);
  useEffect(() => {
    const loadStickers = async () => {
      const newStickers = await queryStickers(group);
      setStickers(newStickers.assets);
    };
    loadStickers();
  }, [queryStickers, group]);
  return (
    <div className={classes.wrapper}>
      {stickers.map(({ label, meta: { uri } }) => (
        <button
          className={classes.button}
          key={uri}
          onClick={() => onClick(uri)}
        >
          <img className={classes.img} src={uri} alt={label} />
        </button>
      ))}
    </div>
  );
};
export default StickerSelect;
