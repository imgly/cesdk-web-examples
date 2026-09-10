/**
 * UI Configuration - Orchestrates All UI Setup
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/overview-41101a/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupCanvas } from './canvas';
import { setupComponents } from './components';
import { setupDock } from './dock';
import { setupInspectorBar } from './inspectorBar';
import { setupNavigationBar } from './navigationBar';
import { setupPanels } from './panel';

/**
 * Set up all UI components for the design editor.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupUI(cesdk: CreativeEditorSDK): void {
  setupPanels(cesdk); // Panel positions first (affects layout)
  setupComponents(cesdk); // Custom components
  setupNavigationBar(cesdk); // Top bar
  setupCanvas(cesdk); // Canvas bar and context menu
  setupInspectorBar(cesdk); // Contextual toolbar
  setupDock(cesdk); // Left side asset panel
}

// Re-export for selective use
export {
  setupCanvas,
  setupComponents,
  setupDock,
  setupInspectorBar,
  setupNavigationBar,
  setupPanels
};
