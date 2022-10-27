import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as DownloadIcon } from '../../icons/Download.svg';
import { ReactComponent as LoadingSpinnerIcon } from '../../icons/LoadingSpinner.svg';
import SmallButton from '../SmallButton/SmallButton';
import classes from './TopBar.module.css';

const TopBar = () => {
  const [isExporting, setIsExporting] = useState(false);

  const { creativeEngine, editMode, refocus, canRecenter, enableAutoRecenter } =
    useEditor();

  const handleExport = async () => {
    setIsExporting(true);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 0));
    const blob = await creativeEngine.block.export(
      creativeEngine.scene.get(),
      'image/jpeg',
      {}
    );
    localDownload(blob, 'my-photo');
    setIsExporting(false);
  };

  return (
    <div className={classes.topBar}>
      <div className={classes.doneWrapper} />
      <div className={classes.centerWrapper}>
        {editMode === 'Crop' && !enableAutoRecenter && (
          <SmallButton
            variant="secondary"
            onClick={refocus}
            disabled={!canRecenter}
          >
            Recenter
          </SmallButton>
        )}
      </div>
      <div className={classes.ctaWrapper}>
        <SmallButton
          variant={'primary'}
          onClick={() => handleExport()}
          disabled={isExporting}
        >
          <span className={classes.ctaText}>Export Image</span>
          {isExporting ? (
            <LoadingSpinnerIcon className={classes.spinning} />
          ) : (
            <DownloadIcon />
          )}
        </SmallButton>
      </div>
    </div>
  );
};
export default TopBar;

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
