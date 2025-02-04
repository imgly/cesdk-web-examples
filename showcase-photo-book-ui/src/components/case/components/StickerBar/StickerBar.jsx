import { useCallback, useEffect, useState } from 'react';
import { useEngine } from '../../lib/EngineContext';

import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import IconButton from '../IconButton/IconButton';

const StickerBar = ({ onClick }) => {
  const { engine } = useEngine();
  const [stickers, setStickers] = useState([]);

  const queryStickers = useCallback(async () => {
    const STICKER_ASSET_LIBRARY_ID = 'stickers';
    const queryParameters = { page: 1, perPage: 999 };
    const results = await engine.asset.findAssets(
      STICKER_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  }, [engine]);

  useEffect(() => {
    const loadStickers = async () => {
      const newStickers = await queryStickers();
      setStickers(newStickers.assets);
    };
    loadStickers();
  }, [queryStickers]);

  return (
    <AdjustmentsBar gap="md">
      {stickers.map((asset, i) => (
        <IconButton
          key={asset.type}
          onClick={() => onClick(asset)}
          icon={<img src={asset.meta.uri} alt={`Add sticker ${i}`} />}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default StickerBar;
