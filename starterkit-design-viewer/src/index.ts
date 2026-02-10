/**
 * CE.SDK Viewer Starterkit - Main Entry Point
 *
 * A read-only viewer for design preview and approval workflows.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initDesignViewer } from './imgly';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-viewer-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,

  // Local assets for development
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  }),

  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize Viewer
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initDesignViewer(cesdk);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
