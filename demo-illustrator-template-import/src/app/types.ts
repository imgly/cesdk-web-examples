/**
 * Type definitions for Illustrator Template Import Starterkit
 */
import type { Configuration } from '@cesdk/cesdk-js';

export interface ExampleFile {
  name: string;
  psdFileUrl: string;
  aiFileUrl: string;
  aiPreviewUrl: string;
  psdPreviewUrl: string;
  cesdkPreviewUrl: string;
  coverBaseUrl: string;
  alt: string;
  sceneArchiveUrl: string;
}

export interface AppProps {
  editorConfig: Configuration;
}
