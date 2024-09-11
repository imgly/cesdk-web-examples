import { useState } from 'react';
import CreativeEditor from './CreativeEditor';
import { useFileProcessing } from './FileProcessingContext';
import classes from './ResultScreen.module.css';
import ChevronLeftIcon from './icons/ChevronLeft.svg';
import DownloadIcon from './icons/Download.svg';
import EditIcon from './icons/Edit.svg';
import IndesignFileIcon from './icons/IndesignFile.svg';
import { InfoButton } from './InfoButton/InfoButton';

function ResultScreen() {
  const { result, currentFile, resetState } = useFileProcessing();

  const [editorOpen, setEditorOpen] = useState(false);

  if (!result) return null;

  const { messages } = result;
  const warnings = messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);
  const errors = messages
    .filter((m) => m.type === 'error')
    .map((m) => m.message);

  return (
    <>
      <div className={classes.header}>
        <button
          className={'button button--secondary-plain button--small'}
          onClick={() => resetState()}
        >
          <ChevronLeftIcon /> <span>New File</span>
        </button>
        <div className={classes.infoButtons}>
          <InfoButton messages={warnings} type="warning" />
          <InfoButton messages={errors} type="error" />
        </div>
      </div>
      <div className={classes.comparisonWrapper}>
        <div>
          <h5 className="h5">InDesign File</h5>
          <span className={classes.previewText}>
            {currentFile?.previewUrl && 'PNG Preview'}
            {!currentFile?.previewUrl && 'No Preview Available'}
          </span>
        </div>
        <div className={classes.preview}>
          {currentFile?.previewUrl && (
            <img
              alt="InDesign File"
              src={currentFile?.previewUrl}
              className={classes.comparisonImage}
            />
          )}
          {!currentFile?.previewUrl && (
            <span>
              <IndesignFileIcon />
              Please compare with {currentFile?.name} in InDesign on your
              machine
            </span>
          )}
        </div>
        <div />

        <div className={classes.divider}></div>

        <div>
          <h5 className="h5">Imported Result</h5>
          <span className={classes.previewText}>PNG Preview</span>
        </div>
        <div className={classes.preview}>
          <img
            src={result.imageUrl}
            className={classes.comparisonImage}
            alt="Imported Result"
          />
        </div>
        <div className={classes.actions}>
          <button
            className={'button button--primary button--small'}
            onClick={() => setEditorOpen(true)}
          >
            <EditIcon /> <span>Edit</span>
          </button>
          <button
            className={'button button--secondary button--small'}
            onClick={() => {
              const link = document.createElement('a');
              link.href = result.sceneArchiveUrl.toString();
              link.download = 'archive.zip';
              link.click();
            }}
          >
            <DownloadIcon /> <span>Download CE.SDK Archive</span>
          </button>
        </div>
      </div>
      {editorOpen && (
        <CreativeEditor
          sceneUrl={result.sceneUrl}
          closeEditor={() => {
            setEditorOpen(false);
          }}
        />
      )}
    </>
  );
}

export default ResultScreen;
