/**
 * ExampleFileContainer - Example files comparison grid
 */
import classNames from 'classnames';
import type { ExampleFile } from '../types';
import { Icon } from '../Icon/Icon';
import classes from './ExampleFileContainer.module.css';

interface ExampleFileContainerProps {
  files: ExampleFile[];
  onClick: (file: ExampleFile) => void;
  selectedFileName: string | null;
}

export function ExampleFileContainer({
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
              onClick={() => onClick(file)}
            >
              <img
                src={file.coverBaseUrl}
                alt={file.alt}
                srcSet={`${file.coverBaseUrl}.png 1x, ${file.coverBaseUrl}@2x.png 2x`}
              />
              <Icon name="Ai2Psd" className={classes.icon} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
