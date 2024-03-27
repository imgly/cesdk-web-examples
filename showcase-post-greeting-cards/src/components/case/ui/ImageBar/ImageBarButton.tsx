import classNames from 'classnames';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useState } from 'react';

import classes from './ImageBar.module.css';
import { CompleteAssetResult } from '@cesdk/engine';

const ImageBarButton = ({
  imageAsset,
  onClick
}: {
  imageAsset: CompleteAssetResult;
  onClick: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const bufferedOnClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };

  return (
    <button
      className={classes.button}
      onClick={bufferedOnClick}
      disabled={isLoading}
    >
      <img
        height="56"
        src={imageAsset.meta?.thumbUri}
        alt="sample asset"
        className={classNames(classes.image, {
          [classes['image--loading']]: isLoading
        })}
      />
      {isLoading && <LoadingSpinner />}
    </button>
  );
};
export default ImageBarButton;
