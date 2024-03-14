import { CompleteAssetResult } from '@cesdk/engine';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useEditor } from '../../EditorContext';
import Stack from '../Stack/Stack';
import UploadButton from '../UploadButton/UploadButton';
import { useToolbarHeight } from '../UseToolbarHeight/UseToolbarHeight';
import classes from './ImageBar.module.css';
import ImageBarButton from './ImageBarButton';

const ImagesBar = ({
  onClick
}: {
  onClick: (asset: CompleteAssetResult) => Promise<void>;
}) => {
  const { findImageAssets } = useEditor();
  const [images, setImages] = useState<CompleteAssetResult[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const newImages = await findImageAssets();
      setImages(newImages);
    };
    loadImages();
  }, [findImageAssets]);

  const { ref } = useToolbarHeight();

  return (
    <div className={classes.wrapper} ref={ref}>
      <Stack gap="sm" className={classes.bar}>
        <UploadButton
          onUpload={async (asset: CompleteAssetResult) => {
            await onClick(asset);
            // Reload images
            const newImages = await findImageAssets();
            setImages(newImages);
          }}
        />
        {images.length === 0 && <LoadingSpinner />}
        {images.map((image) => (
          <ImageBarButton
            key={image.id}
            imageAsset={image}
            onClick={async () => {
              await onClick(image);
            }}
          />
        ))}
      </Stack>
    </div>
  );
};
export default ImagesBar;
