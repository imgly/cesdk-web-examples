import { useEffect, useState } from 'react';
import classNames from 'classnames';
import classes from './ImageMatting.module.css';
import { ReactComponent as ChevronLeftIcon } from './icons/ChevronLeft.svg';
import { ReactComponent as EditIcon } from './icons/Edit.svg';
import { ReactComponent as SpinnerIcon } from './icons/Spinner.svg';
import { ReactComponent as UploadIcon } from './icons/Upload.svg';
import { useImageMatting } from './utils/matting';

const IMAGE_URLS = [
  {
    url: 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=good-faces-xmSWVeGEnJw-unsplash.jpg&w=1920',
    alt: 'a woman with an afro is looking at the camera by Good Faces'
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dom-hill-nimElTcTNyY-unsplash.jpg&w=1920',
    alt: 'woman in yellow tracksuit standing on basketball court side by Dom Hill'
  },
  {
    url: 'https://images.unsplash.com/photo-1628035514544-ebd32b766089?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=kristian-angelo-KW-jwdSgOw4-unsplash.jpg&w=1920',
    alt: 'man in black leather jacket riding black motorcycle by Kristian Angelo'
  },
  {
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=pauline-loroy-U3aF7hgUSrk-unsplash.jpg&w=1920',
    alt: 'white and brown long coat large dog by Pauline Loroy'
  },
  {
    url: 'https://images.unsplash.com/photo-1540492649367-c8565a571e4b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=andreas-m-p40QuGwGCcw-unsplash.jpg&w=1920',
    alt: 'green plant on yellow ceramic pot by Andreas M'
  }
];

function ImageMatting({ openEditor }) {
  const {
    handleImageUpload,
    imageUrl,
    hasProcessedImage,
    isProcessing,
    processMessage,
    resetState,
    inferenceTime
  } = useImageMatting();
  // NOTE: Checking for the process message string is quiet brittle and might
  // need a better solution in the future, especially if we are going to use
  // the image matting feature in the future for other showcases and might need
  // to change that string.
  const isProcessingImage =
    isProcessing && processMessage === 'Processing Image';
  const [stopwatch, setStopwatch] = useState(0);

  useEffect(() => {
    let timerInstance;

    if (isProcessingImage) {
      timerInstance = setInterval(() => {
        setStopwatch((time) => time + 0.01);
      }, 10);
    } else {
      clearInterval(timerInstance);
      setStopwatch(0);
    }

    return () => clearInterval(timerInstance);
  }, [isProcessing, processMessage, isProcessingImage]);

  return (
    <div className={classes.block}>
      {hasProcessedImage && (
        <div>
          <button className={classes.ghost} onClick={() => resetState()}>
            <ChevronLeftIcon /> <span>New Image</span>
          </button>
        </div>
      )}

      <div className={classNames(classes.preview)}>
        {(isProcessing || hasProcessedImage) && (
          <img
            className={classNames(classes.imagePreview, {
              [classes.blurred]: isProcessing
            })}
            style={{
              opacity: imageUrl && imageUrl !== '' ? 1 : 0
            }}
            src={imageUrl}
            alt={hasProcessedImage ? 'Processed Image' : 'Uploaded Image'}
          />
        )}

        {hasProcessedImage && (
          <button className={classes.primary} onClick={() => openEditor()}>
            <EditIcon /> Edit in CE.SDK
          </button>
        )}

        {!isProcessing && !hasProcessedImage && (
          <div className={classes.uploadControls}>
            <UploadIcon />
            <label className={classes.upload}>
              Upload Image
              <input
                className={classes.hidden}
                type="file"
                onChange={(event) => {
                  const [file] = event.target.files;
                  const objectURL = URL.createObjectURL(file);

                  handleImageUpload(objectURL);
                }}
                accept="image/png, image/jpeg"
              />
            </label>
            <small className={classes.filetypeNotice}>PNG or JPEG</small>
          </div>
        )}

        {isProcessing && processMessage && (
          <div className={classes.processingOverlay}>
            <SpinnerIcon />
            <p className={classes.processMessage}>{processMessage}</p>
            {isProcessingImage && (
              <p className={classes.processStatus}>
                {stopwatch.toFixed(2) + 's'}
                {inferenceTime !== 0 && '/' + inferenceTime.toFixed(2) + 's'}
              </p>
            )}
          </div>
        )}
      </div>
      {!isProcessing && !hasProcessedImage && (
        <div className={classes.sampleImagesWrapper}>
          <span>Or try these examples:</span>

          <div className={classes.sampleImages}>
            {IMAGE_URLS.map(({ url, alt }) => (
              <button
                key={url}
                className={classes.sampleImage}
                onClick={() => {
                  handleImageUpload(url);
                }}
              >
                <img src={url} alt={alt} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageMatting;
