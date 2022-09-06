import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as DownloadIcon } from '../../icons/Download.svg';
import { ReactComponent as SurfaceIcon } from '../../icons/Surface.svg';
import { ReactComponent as LoadingSpinnerIcon } from '../../icons/LoadingSpinner.svg';
import { ReactComponent as RedoIcon } from '../../icons/Redo.svg';
import { ReactComponent as UndoIcon } from '../../icons/Undo.svg';
import CanvasSizeModal from '../CanvasSizeModal/CanvasSizeModal';
import IconButton from '../IconButton/IconButton';
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
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  const {
    isEditable,
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
    localDownload(blob, 'my-design');
    setIsExporting(false);
  };

  // Actions should not be done while in crop mode
  const buttonsEnabled = editMode !== 'Crop';

  if (!isLoaded) {
    return null;
  }

  return (
    <div className={classes.topBar}>
      {sizeModalOpen && (
        <CanvasSizeModal onClose={() => setSizeModalOpen(false)} />
      )}
      <div>
        <IconButton
          disabled={!buttonsEnabled}
          onClick={() => setSizeModalOpen(true)}
          icon={<SurfaceIcon />}
        ></IconButton>
      </div>
      <div>
        {isEditable && (
          <>
            <IconButton
              onClick={() => undo()}
              disabled={!canUndo || !buttonsEnabled}
              icon={<UndoIcon />}
            ></IconButton>
            <IconButton
              onClick={() => redo()}
              disabled={!canRedo || !buttonsEnabled}
              icon={<RedoIcon />}
            ></IconButton>
          </>
        )}
      </div>

      <div>
        <IconButton
          theme="primary"
          size="sm"
          onClick={() => handleExport()}
          disabled={isExporting || !buttonsEnabled}
          title={'download'}
          icon={
            isExporting ? (
              <span className={classes.spinning}>
                <LoadingSpinnerIcon />
              </span>
            ) : (
              <DownloadIcon />
            )
          }
        ></IconButton>
      </div>
    </div>
  );
};
export default TopBar;
