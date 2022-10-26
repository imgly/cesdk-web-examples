import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useState } from 'react';

import classes from './ImageBar.module.css';

const ImageBarButton = ({ thumbUri, meta: { uri }, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await onSelect(uri);
    setIsLoading(false);
  };

  return (
    <button className={classes.button} onClick={onClick} disabled={isLoading}>
      <img
        height="56"
        src={thumbUri}
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
