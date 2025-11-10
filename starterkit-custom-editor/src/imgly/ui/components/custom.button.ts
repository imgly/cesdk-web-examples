/**
 * Custom Button Component - Example dock button for custom editor
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { BuilderRenderFunctionContext } from '@cesdk/cesdk-js';

const CUSTOM_PANEL_ID = 'custom-editor.custom-panel';

export function defineCustomButton(
  context: BuilderRenderFunctionContext<any>,
  cesdk: CreativeEditorSDK
): void {
  const {
    builder: { Button }
  } = context;

  const isPanelOpen = cesdk.ui.isPanelOpen(CUSTOM_PANEL_ID);

  Button('custom-panel-button', {
    label: 'Custom',
    isActive: isPanelOpen,
    onClick: () => {
      if (isPanelOpen) {
        cesdk.ui.closePanel(CUSTOM_PANEL_ID);
      } else {
        cesdk.ui.openPanel(CUSTOM_PANEL_ID);
      }
    }
  });
}
