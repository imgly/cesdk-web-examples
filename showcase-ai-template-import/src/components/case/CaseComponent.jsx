'use client';

import { useState } from 'react';
import classes from './CaseComponent.module.css';
import DisclaimerSection from './DisclaimerSection';
import ExampleFileContainer from './ExampleFileContainer';
import ResultScreen from './ResultScreen';

const EXAMPLE_FILES = ['example-1', 'example-2', 'example-3'].map((file) => ({
  name: file,
  psdFileUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/file.psd`,
  aiFileUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/file.ai`,
  aiPreviewUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/preview_ai.png`,
  psdPreviewUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/preview_psd.png`,
  cesdkPreviewUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/preview_cesdk.png`,
  coverBaseUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/thumbnail`,
  alt: `${file} thumbnail`,
  sceneArchiveUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-template-import/${file}/scene.archive`
}));

const CaseComponent = () => {
  const [currentExampleFile, setCurrentExampleFile] = useState(null);

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.block}>
          <DisclaimerSection />
        </div>
        <div className={classes.block}>
          <ExampleFileContainer
            onClick={(file) => {
              if (currentExampleFile?.name === file.name) {
                setCurrentExampleFile(null);
              } else {
                setCurrentExampleFile(file);
              }
            }}
            files={EXAMPLE_FILES}
            selectedFileName={currentExampleFile?.name}
          />
          {currentExampleFile && (
            <ResultScreen currentFile={currentExampleFile} />
          )}
        </div>
      </div>
    </>
  );
};
export default CaseComponent;
