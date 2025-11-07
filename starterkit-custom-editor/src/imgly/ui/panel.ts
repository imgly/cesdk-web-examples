/**
 * Panel Configuration
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupPanels(cesdk: CreativeEditorSDK): void {
  // #region Custom panel registration
  // Custom panels are now registered in components.ts
  // See ui/components.ts for examples of panel registration
  // #endregion
  // #region Panel position configuration
  // Set panel positions
  // cesdk.ui.setPanelPosition(
  //   '//ly.img.panel/inspector',
  //   'left' as PanelPosition
  // );
  // #endregion
}
