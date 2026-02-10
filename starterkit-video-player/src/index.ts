/**
 * CE.SDK Player Starterkit - Main Entry Point
 *
 * A playback-only video player with no editing capabilities.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initVideoPlayer } from './imgly';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-player-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,

  // Local assets for development
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  }),

  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize Player
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initVideoPlayer(cesdk);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
