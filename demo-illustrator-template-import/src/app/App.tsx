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
import classes from './App.module.css';

/**
 * Demo assets for this example (template files, previews, icons, …) are
 * loaded from the IMG.LY CDN by default. To host them yourself, copy this
 * kit's asset folder to your own CDN or server and change this constant — or
 * set it to `''` and place the files in this app's `public/` directory. No
 * trailing slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.0-rc.0/demo-illustrator-template-import';

const EXAMPLE_FILES: ExampleFile[] = [
  'example-1',
  'example-2',
  'example-3'
].map((file) => ({
  name: file,
  psdFileUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/file.psd`,
  aiFileUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/file.ai`,
  aiPreviewUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/preview_ai.png`,
  psdPreviewUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/preview_psd.png`,
  cesdkPreviewUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/preview_cesdk.png`,
  coverBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/thumbnail`,
  alt: `${file} thumbnail`,
  sceneArchiveUrl: `${DEMO_ASSETS_BASE_URL}/cases/ai-template-import/${file}/scene.archive`
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
