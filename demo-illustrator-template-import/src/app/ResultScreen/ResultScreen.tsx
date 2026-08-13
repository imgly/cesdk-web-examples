/**
 * ResultScreen - 3-column comparison view
 */
import type { ExampleFile } from '../types';
import { Icon } from '../Icon/Icon';
import classes from './ResultScreen.module.css';

interface ResultScreenProps {
  currentFile: ExampleFile;
  onOpenEditor: () => void;
}

export function ResultScreen({ currentFile, onOpenEditor }: ResultScreenProps) {
  return (
    <>
      <div className={classes.comparisonWrapper}>
        {/* AI Preview */}
        <div>
          <h5 className={classes.heading}>Original Illustrator File</h5>
          <span className={classes.previewText}>PNG Preview</span>
        </div>

        <div className={classes.preview}>
          {currentFile.aiPreviewUrl && (
            <img
              alt="Original Illustrator File"
              src={currentFile.aiPreviewUrl}
              className={classes.comparisonImage}
            />
          )}
        </div>
        <div className={classes.actions}>
          <button
            className="btn btn-secondary btn-small"
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentFile.aiFileUrl;
              link.download = `${currentFile.name}.ai`;
              link.click();
            }}
          >
            <Icon name="Download" /> <span>Download AI File</span>
          </button>
        </div>

        <div className={classes.divider}></div>

        {/* PSD Preview */}
        <div>
          <h5 className={classes.heading}>Exported PSD File</h5>
          <span className={classes.previewText}>PNG Preview</span>
        </div>
        <div className={classes.preview}>
          <img
            src={currentFile.psdPreviewUrl}
            className={classes.comparisonImage}
            alt="Exported PSD File"
          />
        </div>
        <div className={classes.actions}>
          <button
            className="btn btn-secondary btn-small"
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentFile.psdFileUrl;
              link.download = `${currentFile.name}.psd`;
              link.click();
            }}
          >
            <Icon name="Download" /> <span>Download PSD File</span>
          </button>
        </div>

        <div className={classes.divider}></div>

        {/* CE.SDK Preview */}
        <div>
          <h5 className={classes.heading}>Imported to CE.SDK</h5>
          <span className={classes.previewText}>PNG Preview</span>
        </div>
        <div className={classes.preview}>
          <img
            src={currentFile.cesdkPreviewUrl}
            className={classes.comparisonImage}
            alt="Imported to CE.SDK"
          />
        </div>
        <div className={classes.actions}>
          <div className={classes.buttons}>
            <button
              className="btn btn-primary btn-small"
              onClick={onOpenEditor}
            >
              <Icon name="Edit" /> <span>Edit in CE.SDK</span>
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                const link = document.createElement('a');
                link.href = currentFile.sceneArchiveUrl;
                link.download = 'archive.imgly';
                link.click();
              }}
            >
              <Icon name="Download" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
