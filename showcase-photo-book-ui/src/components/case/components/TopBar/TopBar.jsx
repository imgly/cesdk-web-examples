import classNames from 'classnames';
import { useState } from 'react';
import { ReactComponent as DownloadIcon } from '../../icons/Download.svg';
import { ReactComponent as LoadingSpinnerIcon } from '../../icons/LoadingSpinner.svg';
import { ReactComponent as RedoIcon } from '../../icons/Redo.svg';
import { ReactComponent as UndoIcon } from '../../icons/Undo.svg';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import { useHistory } from '../../lib/useHistory';
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
  const { engine } = useEngine();
  const { canRedo, canUndo } = useHistory();
  const { sortedPageIds, currentPageBlockId, setEnabled } = useSinglePageMode();

  const handleExport = async () => {
    setIsExporting(true);
    setEnabled(false);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Setup scene for export
    sortedPageIds.forEach((block) => engine.block.setVisible(block, true));
    const scene = engine.scene.get();
    engine.block.setFloat(scene, 'scene/dpi', 72);
    const blob = await engine.block.export(scene, 'application/pdf');
    localDownload(blob, 'my-photobook');
    // Reset scene for editing
    engine.block.setFloat(scene, 'scene/dpi', 300);
    sortedPageIds.forEach((block) =>
      engine.block.setVisible(block, currentPageBlockId === block)
    );
    setIsExporting(false);
    setEnabled(true);
  };

  return (
    <div className={classes.topBar}>
      <div className={classes.undoRedo}>
        <button
          onClick={() => engine.editor.undo()}
          className={classNames(classes.undoRedoButton, {
            [classes['undoRedoButton--disabled']]: !canUndo
          })}
          disabled={!canUndo}
        >
          <UndoIcon />
        </button>
        <button
          onClick={() => engine.editor.redo()}
          className={classNames(classes.undoRedoButton, {
            [classes['undoRedoButton--disabled']]: !canRedo
          })}
          disabled={!canRedo}
        >
          <RedoIcon />
        </button>
      </div>
      <div className={classes.viewMode}>
        <h3 className={classes.headline}>Design</h3>
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
