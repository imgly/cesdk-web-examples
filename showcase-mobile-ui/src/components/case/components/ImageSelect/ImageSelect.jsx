import Masonry from 'react-masonry-css';
import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import classes from './ImageSelect.module.css';

export const STOCK_IMAGES = [...Array(10).keys()].map((index) =>
  caseAssetPath(`/images/image${index + 1}.jpg`)
);

const ImageSelect = ({ onSelect, group }) => {
  const { engine } = useEditor();
  const [images, setImages] = useState([]);

  const queryImages = useCallback(async () => {
    const IMAGE_ASSET_LIBRARY_ID = 'ly.img.image';
    const queryParameters = { page: 0, perPage: 9999 };
    if (group) {
      queryParameters.groups = [group];
    }
    const results = await engine.asset.findAssets(
      IMAGE_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  }, [group, engine]);

  useEffect(() => {
    const loadImages = async () => {
      const newImages = await queryImages(group);
      setImages(newImages.assets);
    };
    loadImages();
  }, [queryImages, group]);

  return (
    <Masonry
      breakpointCols={3}
      className={classes.wrapper}
      columnClassName={classes.gridColumn}
    >
      {images.map((asset) => (
        <button
          key={asset.id}
          className={classes.imageButton}
          onClick={() => onSelect(asset)}
        >
          <img height="56" src={asset.meta.thumbUri} alt="sample asset" />
        </button>
      ))}
    </Masonry>
  );
};
export default ImageSelect;
