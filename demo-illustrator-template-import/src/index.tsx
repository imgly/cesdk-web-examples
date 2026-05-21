/**
 * Illustrator Template Import Demo - Entry Point
 *
 * This is the main entry point for the application.
 * It configures the CE.SDK editor and renders the App component.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';
import { App } from './app/App';

/**
 * CE.SDK Editor Configuration
 *
 * This configuration is passed to the CreativeEditor component
 * when opening the editor to edit imported Illustrator files.
 *
 * Note: Role, theme, and typeface libraries are configured via
 * runtime APIs in the AdvancedEditorConfig plugin.
 */
export const editorConfig: Configuration = {
  userId: 'demo-illustrator-template-import-user',

  // Local assets for development

};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);
