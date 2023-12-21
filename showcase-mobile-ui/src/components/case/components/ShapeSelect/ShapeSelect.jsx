import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import Card from '../Card/Card';
import classes from './ShapeSelect.module.css';

const ShapeSelect = ({ onClick, group }) => {
  const { engine } = useEditor();
  const [shapes, setShapes] = useState([]);

  const queryShapes = useCallback(async () => {
    const SHAPE_ASSET_LIBRARY_ID = 'ly.img.vectorpath';
    const queryParameters = { page: 0, perPage: 9999 };
    if (group) {
      queryParameters.groups = [group];
    }
    const results = await engine.asset.findAssets(
      SHAPE_ASSET_LIBRARY_ID,
      queryParameters
    );
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
