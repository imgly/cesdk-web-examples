import classes from './ExampleFileContainer.module.css';
import Ai2PsdIcon from './icons/Ai2Psd.svg';
import classNames from 'classnames';

export interface ExampleFile {
  name: string;
  psdFileUrl: string;
  aiFileUrl: string;
  aiPreviewUrl: string;
  psdPreviewUrl: string;
  cesdkPreviewUrl: string;
  coverBaseUrl: string;
  alt: string;
  sceneArchiveUrl: string;
}

interface ExampleFileContainerProps {
  files: ExampleFile[];
  onClick: (url: ExampleFile) => void;
  selectedFileName: string;
}

function ExampleFileContainer({
  files,
  onClick,
  selectedFileName
}: ExampleFileContainerProps) {
  return (
    <div className={classes.sampleImagesWrapper}>
      <span>Compare example files:</span>

      <div className={classes.sampleImages}>
        {files.map((file) => (
          <div
            className={classNames(
              classes.sampleImageWrapper,
              selectedFileName === file.name ? classes.selected : ''
            )}
            key={file.name}
          >
            <button
              key={file.name}
              className={classes.sampleImage}
              onClick={() => {
                onClick(file);
              }}
            >
              <img
                src={file.coverBaseUrl}
                alt={file.alt}
                srcSet={`${file.coverBaseUrl}.png 1x, ${file.coverBaseUrl}@2x.png 2x`}
              />
              <Ai2PsdIcon className={classes.icon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExampleFileContainer;
