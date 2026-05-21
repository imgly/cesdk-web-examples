/**
 * Illustrator Template Import Starterkit - Main App Component
 */
import { useState } from 'react';
import './app.css';
import type { ExampleFile, AppProps } from './types';
import { CreativeEditor } from './CreativeEditor/CreativeEditor';
import { DisclaimerSection } from './DisclaimerSection/DisclaimerSection';
import { ExampleFileContainer } from './ExampleFileContainer/ExampleFileContainer';
import { ResultScreen } from './ResultScreen/ResultScreen';
import { resolveAssetPath } from './resolveAssetPath';
import classes from './App.module.css';

const EXAMPLE_FILES: ExampleFile[] = [
  'example-1',
  'example-2',
  'example-3'
].map((file) => ({
  name: file,
  psdFileUrl: resolveAssetPath(`/cases/ai-template-import/${file}/file.psd`),
  aiFileUrl: resolveAssetPath(`/cases/ai-template-import/${file}/file.ai`),
  aiPreviewUrl: resolveAssetPath(
    `/cases/ai-template-import/${file}/preview_ai.png`
  ),
  psdPreviewUrl: resolveAssetPath(
    `/cases/ai-template-import/${file}/preview_psd.png`
  ),
  cesdkPreviewUrl: resolveAssetPath(
    `/cases/ai-template-import/${file}/preview_cesdk.png`
  ),
  coverBaseUrl: resolveAssetPath(`/cases/ai-template-import/${file}/thumbnail`),
  alt: `${file} thumbnail`,
  sceneArchiveUrl: resolveAssetPath(
    `/cases/ai-template-import/${file}/scene.archive`
  )
}));

export function App({ editorConfig }: AppProps) {
  const [currentExampleFile, setCurrentExampleFile] =
    useState<ExampleFile | null>(EXAMPLE_FILES[0]);
  const [editorOpen, setEditorOpen] = useState(false);

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
            selectedFileName={currentExampleFile?.name ?? null}
          />
          {currentExampleFile && (
            <ResultScreen
              currentFile={currentExampleFile}
              onOpenEditor={() => setEditorOpen(true)}
            />
          )}
        </div>
      </div>
      {editorOpen && currentExampleFile && (
        <CreativeEditor
          sceneArchiveUrl={currentExampleFile.sceneArchiveUrl}
          editorConfig={editorConfig}
          closeEditor={() => setEditorOpen(false)}
        />
      )}
    </>
  );
}
