import classNames from 'classnames';
import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as DownloadIcon } from '../../icons/Download.svg';
import { ReactComponent as LoadingSpinnerIcon } from '../../icons/LoadingSpinner.svg';
import { ReactComponent as RedoIcon } from '../../icons/Redo.svg';
import { ReactComponent as UndoIcon } from '../../icons/Undo.svg';
import ProcessNavigation from '../ProcessNavigation/ProcessNavigation';
import classes from './TopBar.module.css';

const localDownload = (data, filename) => {
  return new Promise((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    resolve();
  });
};

const TopBar = () => {
  const [isExporting, setIsExporting] = useState(false);

  const { creativeEngine, canUndo, canRedo, sceneIsLoaded, editMode } =
    useEditor();

  const handleExport = async () => {
    setIsExporting(true);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 0));
    const blob = await creativeEngine.block.export(
      creativeEngine.scene.get(),
      'application/pdf'
    );
    localDownload(blob, 'my-postcard');
    setIsExporting(false);
  };

  return (
    <div className={classes.topBar}>
      <div className={classes.undoRedo}>
        {false && (
          <>
            <button
              onClick={() => creativeEngine.editor.undo()}
              className={classNames(classes.undoRedoButton, {
                'undoRedoButton--disabled': !canUndo
              })}
              disabled={!canUndo}
            >
              <UndoIcon />
            </button>
            <button
              onClick={() => creativeEngine.editor.redo()}
              className={classNames(classes.undoRedoButton, {
                [classes['undoRedoButton--disabled']]: !canRedo
              })}
              disabled={!canRedo}
            >
              <RedoIcon />
            </button>
          </>
        )}
      </div>
      <div className={classes.viewMode}>
        <ProcessNavigation disabled={!sceneIsLoaded || editMode === 'Crop'} />
      </div>

      <div className={classes.ctaWrapper}>
        <button
          className={classes.cta}
          onClick={() => handleExport()}
          disabled={!sceneIsLoaded || isExporting}
        >
          <span className={classes.ctaText}>Export</span>
          {isExporting ? (
            <span className={classes.spinning}>
              <LoadingSpinnerIcon />
            </span>
          ) : (
            <DownloadIcon />
          )}
        </button>
      </div>
    </div>
  );
};
export default TopBar;
