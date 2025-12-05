/**
 * Custom Editor UI Components
 * @see https://img.ly/docs/cesdk/sveltekit/user-interface/appearance/theming-4b0938/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
// import type { BuilderRenderFunctionContext } from '@cesdk/cesdk-js';

// import { defineCustomButton } from './components/custom.button';
// import { defineCustomPanel } from './components/custom.panel';

// const CUSTOM_PANEL_ID = 'custom-editor.custom-panel';
// const CUSTOM_BUTTON_ID = 'custom-editor.custom-button.dock';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupComponents(cesdk: CreativeEditorSDK): void {
  // Register custom panel
  // cesdk.ui.registerPanel(
  //   CUSTOM_PANEL_ID,
  //   (context: BuilderRenderFunctionContext<any>): void => {
  //     defineCustomPanel(context);
  //   }
  // );
  // Register custom button component that opens the panel
  // cesdk.ui.registerComponent(
  //   CUSTOM_BUTTON_ID,
  //   (context: BuilderRenderFunctionContext<any>): void => {
  //     defineCustomButton(context, cesdk);
  //   }
  // );
  // Example: Add button to the dock component
  // const currentDockOrder = cesdk.ui.getDockOrder();
  // cesdk.ui.setDockOrder([...currentDockOrder, 'ly.img.spacer', CUSTOM_BUTTON_ID]);
}
