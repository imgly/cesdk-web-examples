import classes from './ExampleFileContainer.module.css';
import PowerPointFileIcon from './icons/PowerPointFile.svg';

export interface ExampleFile {
  url: string;
  alt: string;
  previewUrl: string;
  coverBaseUrl: string;
  name: string;
}

interface ExampleFileContainerProps {
  files: ExampleFile[];
  onClick: (url: ExampleFile) => void;
}

function ExampleFileContainer({ files, onClick }: ExampleFileContainerProps) {
  return (
    <div className={classes.sampleImagesWrapper}>
      <span>Or try these examples:</span>

      <div className={classes.sampleImages}>
        {files.map((file) => (
          <div className={classes.sampleImageWrapper} key={file.url}>
            <button
              key={file.url}
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
              <PowerPointFileIcon className={classes.icon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExampleFileContainer;
