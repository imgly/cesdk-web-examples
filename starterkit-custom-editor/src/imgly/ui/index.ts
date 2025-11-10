/**
 * Custom Editor UI - UI configuration for custom editing workflows
 * @see https://img.ly/docs/cesdk/sveltekit/user-interface/appearance/theming-4b0938/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupCanvas } from './canvas';
import { setupComponents } from './components';
import { setupDock } from './dock';
import { setupInspectorBar } from './inspectorBar';
import { setupNavigationBar } from './navigationBar';
import { setupPanels } from './panel';

export function setupUI(cesdk: CreativeEditorSDK): void {
  setupPanels(cesdk);
  setupNavigationBar(cesdk);
  setupCanvas(cesdk);
  setupInspectorBar(cesdk);
  setupDock(cesdk);
  setupComponents(cesdk);
}
