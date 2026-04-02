import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import Card from '../Card/Card';
import classes from './ShapeSelect.module.css';

const ShapeSelect = ({ onClick, group }) => {
  const { engine } = useEditor();
  const [shapes, setShapes] = useState([]);

  const queryShapes = useCallback(async () => {
    const SHAPE_ASSET_LIBRARY_ID = 'ly.img.vector.shape';
    const queryParameters = { page: 0, perPage: 9999 };
    if (group) {
      queryParameters.groups = [group];
    }
    let results = await engine.asset.findAssets(
      SHAPE_ASSET_LIBRARY_ID,
      queryParameters
    );
    let filtered = [];
    results.assets.forEach((shape) => {
      if (
        !(
          shape.groups &&
          [
            '//ly.img.cesdk.vectorpaths/category/gradient',
            '//ly.img.cesdk.vectorpaths/category/image',
            '//ly.img.cesdk.vectorpaths/category/abstract-gradient',
            '//ly.img.cesdk.vectorpaths/category/abstract-image'
          ].includes(shape.groups[0])
        )
      ) {
        filtered.push(shape);
      }
    });
    results = {
      ...results,
      assets: filtered
    };
    return results;
  }, [group, engine]);

  useEffect(() => {
    const loadShapes = async () => {
      const newShapes = await queryShapes(group);
      setShapes(newShapes.assets);
    };
    loadShapes();
  }, [queryShapes, group]);

  return (
    <div className={classes.wrapper}>
      {shapes.map((asset) => (
        <Card
          key={asset.id}
          onClick={() => onClick(asset)}
          backgroundImage={asset.meta.thumbUri}
        ></Card>
      ))}
    </div>
  );
};
export default ShapeSelect;
