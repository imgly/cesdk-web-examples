import { useEditor } from '../../EditorContext';
import { getImageDimensions } from './getImageDimensions';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { uploadFile } from '../../lib/upload';
import IconButton from '../IconButton/IconButton';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

async function fileUploadToAsset(file) {
  const url = window.URL.createObjectURL(file);
  const { width, height } = await getImageDimensions(url);

  return {
    id: url,
    meta: {
      uri: url,
      thumbUri: url,
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
      width,
      height
    }
  };
}

const UploadImageButton = ({ multiple, onUpload }) => {
  const { engine } = useEditor();

  return (
    <div>
      <IconButton
        onClick={async () => {
          const files = await uploadFile({
            multiple,
            supportedMimeTypes: SUPPORTED_MIME_TYPES
          });

          const uploadedAssets = await Promise.all(
            files.map(async (file) => fileUploadToAsset)
          );

          uploadedAssets.forEach((asset) =>
            engine.asset.addAssetToSource('ly.img.image', asset)
          );
          uploadedAssets.forEach((asset) =>
            onUpload({ ...asset, context: { sourceId: 'ly.img.image' } })
          );
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
