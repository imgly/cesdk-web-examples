import { useEditor } from '../../EditorContext';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { uploadFile } from '../../lib/upload';
import IconButton from '../IconButton/IconButton';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

const UploadImageButton = ({ onUpload }) => {
  const { setLocalUploads, localUploads } = useEditor();

  return (
    <div>
      <IconButton
        onClick={async () => {
          const files = await uploadFile({
            supportedMimeTypes: SUPPORTED_MIME_TYPES
          });

          const fileUrls = files.map((file) =>
            window.URL.createObjectURL(file)
          );
          fileUrls.forEach((fileUrl) => onUpload(fileUrl));
          setLocalUploads([...localUploads, ...fileUrls]);
        }}
        icon={
          <>
            <UploadIcon />
            <span>Upload</span>
          </>
        }
      />
    </div>
  );
};
export default UploadImageButton;
