/**
 * CE.SDK Premium Templates Editor - React Entry Point
 *
 * Main entry point that renders the React application.
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';

const config: Configuration = {
  userId: 'demo-premium-templates-editor-user',
  role: 'Adopter',

  // Local assets for development
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  }),

  license: import.meta.env.VITE_CESDK_LICENSE
};

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App config={config} />
  </StrictMode>
);
