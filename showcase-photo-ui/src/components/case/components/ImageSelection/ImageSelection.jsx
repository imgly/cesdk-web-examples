import classNames from 'classnames';
import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import classes from './ImageSelection.module.css';

export default function ImageSelection({ onShowModal, images }) {
  const { engineIsLoaded, changeImage, selectedImageUrl, creativeEngine } =
    useEditor();

  const onClick = (imageUrl) => {
    if (creativeEngine.editor.canUndo()) {
      onShowModal(imageUrl);
    } else {
      changeImage(imageUrl, true);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <h4 className={classes.header}>Select Image</h4>
        <div className={classes.imageBar}>
          {engineIsLoaded && (
            <>
              {images.map((src, i) => (
                <button
                  key={src}
                  className={classNames(classes.imageButton, {
                    [classes['imageButton--active']]:
                      selectedImageUrl ===
                      caseAssetPath('/images/' + src + '.jpg')
                  })}
                  onClick={() =>
                    onClick(caseAssetPath('/images/' + src + '.jpg'))
                  }
                >
                  <img
                    alt={i}
                    src={caseAssetPath('/images/small-' + src + '.jpg')}
                  />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
