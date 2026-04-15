/**
 * CreativeEditor - CE.SDK Editor full-screen view component
 * Uses the official @cesdk/cesdk-js/react wrapper
 */
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';
import CreativeEditorComponent from '@cesdk/cesdk-js/react';
import { initIllustratorTemplateImportEditor } from '../../imgly';
import classes from './CreativeEditor.module.css';

interface CreativeEditorProps {
  sceneArchiveUrl: string;
  editorConfig: Configuration;
  closeEditor: () => void;
}

export function CreativeEditor({
  sceneArchiveUrl,
  editorConfig,
  closeEditor
}: CreativeEditorProps) {
  return (
    <div className={classes.fullscreenWrapper}>
      <CreativeEditorComponent
        config={editorConfig}
        init={async (cesdk: CreativeEditorSDK) => {
          // Debug access (remove in production)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).cesdk = cesdk;

          // Initialize the editor with Illustrator template import configuration
          await initIllustratorTemplateImportEditor(cesdk);

          // Add back button to navigate back
          cesdk.ui.insertOrderComponent(
            { in: 'ly.img.navigation.bar', position: 'start' },
            { id: 'ly.img.back.navigationBar', onClick: closeEditor }
          );

          // Fetch the archive and create a blob URL
          // This approach works more reliably than loading from static URLs
          const response = await fetch(sceneArchiveUrl);
          const archiveBlob = await response.blob();
          const archiveBlobUrl = URL.createObjectURL(archiveBlob);

          // Load the scene from the blob URL
          await cesdk.loadFromArchiveURL(archiveBlobUrl);

          // Clean up the blob URL
          URL.revokeObjectURL(archiveBlobUrl);
        }}
        onError={(error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to initialize CE.SDK:', error);
          closeEditor();
        }}
        width="100%"
        height="100%"
      />
    </div>
  );
}
