import { CreativeEngine, MimeType } from '@cesdk/cesdk-js';
import React, { useCallback, useState } from 'react';

import { Footer } from './components/Footer/Footer';
import { Pages } from './components/Pages/Pages';
import { Quality } from './components/Quality/Quality';
import { Resolution } from './components/Resolution/Resolution';
import { SectionDivider } from './components/SectionDivider/SectionDivider';
import { SegmentedControl } from './components/SegmentedControl/SegmentedControl';
import classes from './ExportModal.module.css';
import { getPagesFromRange } from './lib/getPagesFromRange';
import { localDownload } from './lib/localDownload';
import { QualityType } from './types';

const MimeTypeItems = [
  { label: 'JPG', value: MimeType.Jpeg },
  { label: 'PNG', value: MimeType.Png },
  { label: 'PDF', value: MimeType.Pdf }
];

const QualityJpeg = {
  [QualityType.Low]: 0.2,
  [QualityType.Medium]: 0.4,
  [QualityType.High]: 0.6,
  [QualityType.VeryHigh]: 0.8,
  [QualityType.Maximum]: 1
};

const QualityPng = {
  [QualityType.Low]: 9,
  [QualityType.Medium]: 7,
  [QualityType.High]: 5,
  [QualityType.VeryHigh]: 3,
  [QualityType.Maximum]: 1
};

interface Props {
  show: boolean;
  engine: CreativeEngine;
}

export const ExportModal: React.FC<Props> = ({ show, engine }) => {
  const [mimeType, setMimeType] = useState<MimeType>(MimeType.Jpeg);
  const [qualityType, setQualityType] = useState<QualityType>(QualityType.High);
  const [pageRange, setPageRange] = useState<string>('');

  const [scale, setScale] = useState<number>(1);

  const handleExport = useCallback(async () => {
    const scene = engine.scene.get();
    if (!scene) {
      return;
    }
    const pages = engine.scene.getPages();
    let filteredPages: number[] = pages;
    try {
      filteredPages = getPagesFromRange(pages, pageRange);
    } catch (error) {
      return;
    }
    // the export will create a single PDF and download it
    if (mimeType === MimeType.Pdf) {
      const hiddenPages = pages.filter(
        (id: number) => !filteredPages.includes(id)
      );

      // hide pages from export that are not specified in the range
      hiddenPages.forEach((id: number) => {
        engine.block.setVisible(id, false);
      });

      const blob = await engine.block.export(scene, mimeType);

      hiddenPages.forEach((id: number) => {
        engine.block.setVisible(id, true);
      });

      await localDownload(blob, 'my-design');
    } else {
      // resize the exported image
      const exportPageWidth =
        engine.block.getFloat(scene, 'scene/pageDimensions/width') * scale;
      const exportPageHeight =
        engine.block.getFloat(scene, 'scene/pageDimensions/height') * scale;

      // each page will be exported and downloaded separately
      for (let i = 0; i < filteredPages.length; i++) {
        const blob = await engine.block.export(filteredPages[i], mimeType, {
          targetWidth: exportPageWidth,
          targetHeight: exportPageHeight,
          jpegQuality: QualityJpeg[qualityType],
          pngCompressionLevel: QualityPng[qualityType]
        });

        await localDownload(blob, `my-design-page-${i + 1}`);
      }
    }
  }, [engine, mimeType, qualityType, scale, pageRange]);

  if (!show) {
    return <div className={classes.modal}></div>;
  }

  return (
    <div className={classes.modal}>
      <h4 className={classes.title}>Export Settings</h4>
      <div className={classes.body}>
        <SegmentedControl<MimeType>
          className={classes.mimeType}
          name="Export-MimeType"
          value={mimeType}
          options={MimeTypeItems}
          onChange={setMimeType}
        />
        <div className={classes.subtitle}>
          <span>
            {mimeType === MimeType.Jpeg && 'Shareable web format'}
            {mimeType === MimeType.Png && 'Complex Images with Transparency'}
            {mimeType === MimeType.Pdf && 'Best for Printing'}
          </span>
        </div>
        <SectionDivider />
        <Pages className={classes.pages} setPageRange={setPageRange} />
        {mimeType !== MimeType.Pdf && (
          <>
            <SectionDivider
              className={classes.smallDivider}
              fullWidth={false}
            />
            <Quality
              name="Export-Quality"
              className={classes.quality}
              value={qualityType}
              onChange={setQualityType}
            />
            <SectionDivider />
            <Resolution
              className={classes.resolution}
              engine={engine}
              setScale={setScale}
            />
          </>
        )}
      </div>
      <Footer className={classes.footer} onExport={handleExport} />
    </div>
  );
};
