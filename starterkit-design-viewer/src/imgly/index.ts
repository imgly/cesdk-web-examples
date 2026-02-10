/**
 * CE.SDK Viewer - Initialization Module
 *
 * This module provides the main entry point for initializing the viewer.
 * Import and call `initDesignViewer()` to configure a CE.SDK instance for viewing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

// Configuration
import { ViewerConfig } from './config/plugin';
import { setupActions } from './config/actions';

// Re-export for external use
export { ViewerConfig } from './config/plugin';

/**
 * Initialize the CE.SDK Viewer with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Viewer UI configuration (read-only viewing mode)
 * - Navigation controls (pan, zoom)
 * - Page navigation for multi-page designs
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initDesignViewer(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new ViewerConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');

  // ============================================================================
  // Actions Setup
  // ============================================================================

  setupActions(cesdk);

  // ============================================================================
  // Scene Loading
  // ============================================================================

  await cesdk.loadFromArchiveURL(
    'https://cdn.img.ly/packages/imgly/plugin-marketing-asset-source-web/1.0.0/assets/templates/1-1-marketing-multipost.zip'
  );

  // Zoom to fit the content with padding
  cesdk.actions.run('zoom.toPage', {
    page: 'first',
    autoFit: true,
    padding: 24
  });
}
