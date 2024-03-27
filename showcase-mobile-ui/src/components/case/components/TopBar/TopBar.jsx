import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import DownloadIcon from '../../icons/Download.svg';
import LoadingSpinnerIcon from '../../icons/LoadingSpinner.svg';
import RedoIcon from '../../icons/Redo.svg';
import SurfaceIcon from '../../icons/Surface.svg';
import UndoIcon from '../../icons/Undo.svg';
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
    engineIsLoaded,
    canUndo,
    canRedo,
    editMode,
    currentPageBlockId,
    engine,
    refocus
  } = useEditor();

  const handleExport = async () => {
    setIsExporting(true);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 0));
    const blob = await engine.block.export(currentPageBlockId, 'image/png');
    localDownload(blob, 'my-design');
    setIsExporting(false);
  };

  // Actions should not be done while in crop mode
  const buttonsEnabled = editMode !== 'Crop';

  if (!engineIsLoaded) {
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
        <IconButton
          onClick={() => {
            engine.editor.undo();
            refocus();
          }}
          disabled={!canUndo || !buttonsEnabled}
          icon={<UndoIcon />}
        ></IconButton>
        <IconButton
          onClick={() => {
            engine.editor.redo();
            refocus();
          }}
          disabled={!canRedo || !buttonsEnabled}
          icon={<RedoIcon />}
        ></IconButton>
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
