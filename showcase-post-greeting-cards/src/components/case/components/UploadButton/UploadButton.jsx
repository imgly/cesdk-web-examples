import classNames from 'classnames';
import classes from './UploadButton.module.css';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { uploadFile } from '../../lib/upload';
import { useEditor } from '../../EditorContext';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

const UploadButton = ({
  icon,
  children,
  isActive,
  iconColor,
  onUpload,
  ...rest
}) => {
  const { setLocalUploads } = useEditor();
  return (
    <button
      className={classNames(classes.button)}
      onClick={async () => {
        const files = await uploadFile({
          supportedMimeTypes: SUPPORTED_MIME_TYPES
        });
        // Hint: In production you probably want to upload user images to your storage.
        const urls = files.map((file) => window.URL.createObjectURL(file));
        urls.forEach((url) => onUpload(url));
        // We mimic the behavior of a custom asset library entry
        const localUploadLibraryItems = urls.map((url) => ({
          meta: { 
            blockType: '//ly.img.ubq/image',
            uri: url,
            thumbUri: url
          }
        }));
        setLocalUploads((uploads) => [...localUploadLibraryItems, ...uploads]);
      }}
      {...rest}
    >
      <span className={classes.iconWrapper} style={{ color: iconColor }}>
        <UploadIcon />
      </span>
      <span className={classes.label}>Upload</span>
    </button>
  );
};
export default UploadButton;
