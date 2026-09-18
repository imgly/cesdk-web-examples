/**
 * CE.SDK Static / Video Mode Switch Demo - React Entry Point
 *
 * Demonstrates switching the editor between a Static (design) and Video
 * configuration at runtime on the same editor instance and scene, without
 * destroying and recreating the editor.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import App from './app/App';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';

export const editorConfig: Configuration = {
  // Set by `cesdk-js-dev` for local development; undefined otherwise, so the
  // editor falls back to the CDN-hosted assets.
  userId: 'demo-static-video-mode-switch-user',

};

export const SCENE_URL = `${DEMO_ASSETS_BASE_URL}/cases/mode-switch/example.scene`;

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App config={editorConfig} sceneUrl={SCENE_URL} />
  </StrictMode>
);
