import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';

import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.svg'),
  caseAssetPath('/images/image1.svg'),
  caseAssetPath('/images/image4.svg'),
  caseAssetPath('/images/image3.svg')
];

const ImagesBar = () => {
  const {
    customEngine: { changeImageFile }
  } = useEditor();

  return (
    <div className="flex justify-center gap-6">
      <div className="flex">
        {ALL_IMAGES.map((uri) => (
          <button key={uri} onClick={() => changeImageFile(uri)}>
            <img height="56" src={uri} alt="sample asset" />
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
