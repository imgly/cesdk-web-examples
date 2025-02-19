import Masonry from 'react-masonry-css';
import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import classes from './ImageSelect.module.css';

export const STOCK_IMAGES = [...Array(10).keys()].map((index) =>
  caseAssetPath(`/images/image${index + 1}.jpg`)
);

const ImageSelect = ({ onSelect }) => {
  const { localUploads } = useEditor();

  const availableImages = [...localUploads, ...STOCK_IMAGES];

  return (
    <Masonry
      breakpointCols={3}
      className={classes.wrapper}
      columnClassName={classes.gridColumn}
    >
      {availableImages.map((uri) => (
        <button
          key={uri}
          className={classes.imageButton}
          onClick={() => onSelect(uri)}
        >
          <img height="56" src={uri} alt="sample asset" />
        </button>
      ))}
    </Masonry>
  );
};
export default ImageSelect;
