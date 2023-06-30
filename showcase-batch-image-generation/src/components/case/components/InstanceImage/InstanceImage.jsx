import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import React from 'react';
import EditIcon from '../../icons/Edit.svg';
import classes from './InstanceImage.module.css';

const InstanceImage = ({
  image,
  currentTemplate,
  maxWidth,
  maxHeight,
  onClick
}) => {
  const canEdit = !image.isLoading;
  return (
    <div
      className={classes.wrapper}
      style={{ minWidth: currentTemplate.width }}
    >
      <img
        alt=""
        src={image.src}
        className={classNames(classes.image, {
          [classes['image--loading']]: image.isLoading
        })}
        style={{
          maxWidth,
          maxHeight
        }}
      />
      {image.isLoading && <LoadingSpinner />}
      {canEdit && (
        <div className={classes.editOverlay}>
          <button onClick={onClick} className={classes.editButton}>
            <EditIcon />
            <span>Edit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InstanceImage;
