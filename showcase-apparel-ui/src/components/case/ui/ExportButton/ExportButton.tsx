import { useState } from 'react';
import DownloadIcon from '../../icons/Download.svg';
import LoadingSpinnerIcon from '../../icons/LoadingSpinner.svg';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import classes from './ExportButton.module.css';

const localDownload = (data: Blob, filename: string) => {
  return new Promise<void>((resolve) => {
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

interface ExportButtonProps {
  fileName?: string;
}

const ExportButton = ({ fileName = 'my-postcard' }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const handleExport = async () => {
    setIsExporting(true);
    // Let react rerender
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Setup scene for export
    const pages = engine.scene.getPages();
    pages.forEach((block) => engine.block.setVisible(block, true));
    const scene = engine.scene.get()!;
    engine.block.setFloat(scene, 'scene/dpi', 72);
    // @ts-ignore
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf'
    });
    // Reset scene for editing
    engine.block.setFloat(scene, 'scene/dpi', 300);
    pages.forEach((block) =>
      engine.block.setVisible(block, currentPageBlockId === block)
    );
    await localDownload(blob, fileName);
    setIsExporting(false);
  };

  return (
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
  );
};
export default ExportButton;
