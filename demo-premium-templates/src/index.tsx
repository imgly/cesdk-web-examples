/**
 * CE.SDK Premium Templates Editor - React Entry Point
 *
 * Main entry point that renders the React application.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
