import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import classes from './ImageBar.module.css';

import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.jpg'),
  caseAssetPath('/images/image1.jpg'),
  caseAssetPath('/images/image4.png'),
  caseAssetPath('/images/image3.png')
];

const ImagesBar = () => {
  const {
    customEngine: { changeImageFile }
  } = useEditor();

  return (
    <div className="gap-md inline-flex">
      <div className="gap-xs flex">
        {ALL_IMAGES.map((uri) => (
          <button key={uri} onClick={() => changeImageFile(uri)}>
            <img src={uri} alt="sample asset" className={classes.image} />
          </button>
        ))}
      </div>
      <div>
        <DeleteSelectedButton />
      </div>
    </div>
  );
};
export default ImagesBar;
