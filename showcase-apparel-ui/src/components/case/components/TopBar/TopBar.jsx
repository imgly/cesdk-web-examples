import classNames from 'classnames';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as DownloadIcon } from '../../icons/Download.svg';
import { ReactComponent as LoadingSpinnerIcon } from '../../icons/LoadingSpinner.svg';
import { ReactComponent as RedoIcon } from '../../icons/Redo.svg';
import { ReactComponent as UndoIcon } from '../../icons/Undo.svg';
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

  const {
    isEditable,
    viewMode,
    setViewMode,
    isLoaded,
    canUndo,
    canRedo,
    editorState: { editMode },
    customEngine: { undo, redo, exportScene }
  } = useEditor();

  const handleExport = async () => {
    setIsExporting(true);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 0));
    const blob = await exportScene();
    localDownload(blob, 'my-tshirt-design');
    setIsExporting(false);
  };

  if (!isLoaded || editMode === 'Crop') {
    return null;
  }

  return (
    <div className={classes.topBar}>
      <div className={classes.undoRedo}>
        {isEditable && (
          <>
            <button
              onClick={() => undo()}
              className={classNames(classes.undoRedoButton, {
                [classes['undoRedoButton--disabled']]: !canUndo
              })}
              disabled={!canUndo}
            >
              <UndoIcon />
            </button>
            <button
              onClick={() => redo()}
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
        <SegmentedControl
          options={[
            { label: 'Edit', value: 'edit' },
            { label: 'Preview', value: 'preview' }
          ]}
          value={viewMode}
          name="viewMode"
          onChange={(value) => setViewMode(value)}
          size="sm"
          buttonStyle={{ minWidth: '75px' }}
        />
      </div>

      <div className={classes.ctaWrapper}>
        <button
          className={classes.cta}
          onClick={() => handleExport()}
          disabled={isExporting}
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
