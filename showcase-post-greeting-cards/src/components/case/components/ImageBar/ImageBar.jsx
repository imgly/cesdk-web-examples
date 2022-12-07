import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEditor } from '../../EditorContext';

import Stack from '../Stack/Stack';
import UploadButton from '../UploadButton/UploadButton';
import classes from './ImageBar.module.css';
import ImageBarButton from './ImageBarButton';

const ImagesBar = ({ onSelect }) => {
  const { images } = useEditor();

  return (
    <div className={classes.wrapper}>
      <Stack gap="sm" className={classes.bar}>
        <UploadButton onUpload={(url) => onSelect(url)} />
        {images.length === 0 && <LoadingSpinner />}
        {images.map((image) => (
          <ImageBarButton key={image.meta.uri} {...image} onSelect={onSelect} />
        ))}
      </Stack>
    </div>
  );
};
export default ImagesBar;
