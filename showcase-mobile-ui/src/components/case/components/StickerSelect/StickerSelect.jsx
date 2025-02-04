import classes from './StickerSelect.module.css';

import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';

const StickerSelect = ({ group, onClick }) => {
  const { creativeEngine } = useEditor();
  const [stickers, setStickers] = useState([]);

  const queryStickers = useCallback(async () => {
    const STICKER_ASSET_LIBRARY_ID = 'stickers';
    const queryParameters = { page: 1, perPage: 999 };
    if (group) {
      queryParameters.groups = [group];
    }
    const results = await creativeEngine.asset.findAssets(
      STICKER_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  }, [group, creativeEngine]);

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
