/**
 * Panel Configuration - Inspector Panel and Asset Library Panel
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure panel positioning and behavior.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupPanels(cesdk: CreativeEditorSDK): void {
  // #region Inspector Panel
  cesdk.ui.setPanelPosition('//ly.img.panel/inspector', 'left');
  cesdk.ui.setPanelFloating('//ly.img.panel/inspector', false);
  // #endregion

  // #region Assets Panel
  cesdk.ui.setPanelPosition('//ly.img.panel/assets', 'left');
  cesdk.ui.setPanelFloating('//ly.img.panel/assets', false);
  // #endregion
}
