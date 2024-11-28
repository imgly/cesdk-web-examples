import { useState } from 'react';
import classNames from 'classnames';
import CreativeEditor from './CreativeEditor';
import classes from './ResultScreen.module.css';
import DownloadIcon from './icons/Download.svg';
import EditIcon from './icons/Edit.svg';
import { ExampleFile } from './ExampleFileContainer';

interface ResultScreenProps {
  currentFile: ExampleFile;
}

function ResultScreen({ currentFile }: ResultScreenProps) {
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <div className={classes.comparisonWrapper}>
        {/* AI Preview */}
        <div>
          <h5 className={classNames('h5', classes.heading)}>
            Original Illustrator File
          </h5>
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
            className={'button button--secondary button--small'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentFile.aiFileUrl;
              link.download = `${currentFile.name}.ai`;
              link.click();
            }}
          >
            <DownloadIcon /> <span> Download AI File</span>
          </button>
        </div>

        <div className={classes.divider}></div>

        {/* Psd Preview */}
        <div>
          <h5 className="h5">Exported PSD File</h5>
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
            className={'button button--secondary button--small'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentFile.psdFileUrl;
              link.download = `${currentFile.name}.psd`;
              link.click();
            }}
          >
            <DownloadIcon /> <span>Download PSD File</span>
          </button>
        </div>

        <div className={classes.divider}></div>

        {/* CE.SDK Preview */}
        <div>
          <h5 className="h5">Imported to CE.SDK</h5>
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
            className={'button button--primary button--small'}
            onClick={() => setEditorOpen(true)}
          >
            <EditIcon /> <span>Edit in CE.SDK</span>
          </button>
          <button
            className={'button button--secondary button--small'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = currentFile.sceneArchiveUrl;
              link.download = 'archive.zip';
              link.click();
            }}
          >
            <DownloadIcon />
          </button>
          </div>
          <div />
        </div>
      </div>
      {editorOpen && (
        <CreativeEditor
          sceneArchiveUrl={currentFile.sceneArchiveUrl}
          closeEditor={() => {
            setEditorOpen(false);
          }}
        />
      )}
    </>
  );
}

export default ResultScreen;
