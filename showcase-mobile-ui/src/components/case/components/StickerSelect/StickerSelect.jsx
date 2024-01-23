import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import Card from '../Card/Card';
import classes from './StickerSelect.module.css';

const StickerSelect = ({ group, onClick }) => {
  const { engine } = useEditor();
  const [stickers, setStickers] = useState([]);

  const queryStickers = useCallback(async () => {
    const STICKER_ASSET_LIBRARY_ID = 'ly.img.sticker';
    const queryParameters = { page: 0, perPage: 9999 };
    if (group) {
      queryParameters.groups = [group];
    }
    const results = await engine.asset.findAssets(
      STICKER_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  }, [group, engine]);

  useEffect(() => {
    const loadStickers = async () => {
      const newStickers = await queryStickers(group);
      setStickers(newStickers.assets);
    };
    loadStickers();
  }, [queryStickers, group]);

  return (
    <div className={classes.wrapper}>
      {stickers.map((asset) => (
        <Card
          key={asset.id}
          onClick={() => onClick(asset)}
          backgroundImage={asset.meta.thumbUri}
        />
      ))}
    </div>
  );
};
export default StickerSelect;
