import { caseAssetPath } from '../../util';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import classes from './ImageBar.module.css';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.jpg'),
  caseAssetPath('/images/image1.jpg'),
  caseAssetPath('/images/image4.png'),
  caseAssetPath('/images/image3.png')
];

const ImagesBar = ({ onSelect }) => {
  return (
    <AdjustmentsBar gap="sm">
      {ALL_IMAGES.map((uri) => (
        <button key={uri} onClick={() => onSelect(uri)}>
          <img
            height="56"
            src={uri}
            alt="sample asset"
            className={classes.image}
          />
        </button>
      ))}
    </AdjustmentsBar>
  );
};
export default ImagesBar;
