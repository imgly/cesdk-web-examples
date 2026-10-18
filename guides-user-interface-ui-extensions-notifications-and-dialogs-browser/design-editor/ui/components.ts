/**
 * Custom Components - Buttons, Panels, and UI Extensions
 *
 * Register custom UI components using the builder API.
 * Add custom buttons to the dock, navigation bar, or inspector bar.
 *
 * ## Component Registration
 *
 * - `cesdk.ui.registerComponent(id, renderFn)` - Register a custom component
 * - `cesdk.ui.registerPanel(id, renderFn)` - Register a custom panel
 *
 * ## Builder API
 *
 * The builder context provides methods to create UI elements:
 * - `builder.Button(id, options)` - Button
 * - `builder.ButtonGroup(id, options)` - Button group
 * - `builder.Checkbox(id, options)` - Checkbox
 * - `builder.ColorInput(id, options)` - Color picker
 * - `builder.Component(id, options)` - Embed another component
 * - `builder.Dropdown(id, options)` - Dropdown menu
 * - `builder.Heading(id, options)` - Heading text
 * - `builder.Library(id, options)` - Asset library
 * - `builder.MediaPreview(id, options)` - Media preview
 * - `builder.NumberInput(id, options)` - Number input
 * - `builder.Section(id, options)` - Section container
 * - `builder.Select(id, options)` - Dropdown select
 * - `builder.Separator(id)` - Visual separator
 * - `builder.Slider(id, options)` - Slider control
 * - `builder.Text(id, options)` - Text content
 * - `builder.TextArea(id, options)` - Multi-line text input
 * - `builder.TextInput(id, options)` - Single-line text input
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/register-new-component-b04a04/
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Register and configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // ADD COMPONENTS TO UI
  // Uncomment to add custom components to the UI
  // ============================================================================
  // #region Add to Dock
  // const currentDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
  // cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [...currentDockOrder, 'ly.img.spacer', CUSTOM_BUTTON_ID]);
  // #endregion
  // ============================================================================
  // EXAMPLE: Navigation bar button that opens a custom panel
  // ============================================================================
  // #region Custom Component - Navigation bar button that opens a custom panel
  // cesdk.ui.registerComponent(
  //   'my-app.export.navigationBar',
  //   ({ builder }) => {
  //     builder.Button('export-button', {
  //       color: 'accent',
  //       variant: 'regular',
  //       label: 'Export',
  //       onClick: () => {
  //         if (cesdk.ui.isPanelOpen('my-app.export-panel')) {
  //           cesdk.ui.closePanel('my-app.export-panel');
  //         } else {
  //           cesdk.ui.openPanel('my-app.export-panel');
  //         }
  //       }
  //     });
  //   }
  // );
  // #endregion
  // ============================================================================
  // EXAMPLE: Custom panel with state management
  // ============================================================================
  // #region Custom Panel - Export options with state management
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'panel.my-app.export-panel': 'Export Design',
  //     'formats/jpeg': 'JPEG',
  //     'formats/png': 'PNG',
  //     'formats/pdf': 'PDF'
  //   }
  // });
  //
  // cesdk.ui.registerPanel(
  //   'my-app.export-panel',
  //   ({ builder, engine, state }) => {
  //     const formatState = state<string>('format', 'jpeg');
  //     const loadingState = state<boolean>('loading', false);
  //
  //     builder.Section('format-section', {
  //       children: () => {
  //         builder.ButtonGroup('format', {
  //           children: () => {
  //             ['jpeg', 'png', 'pdf'].forEach((format) => {
  //               builder.Button(format, {
  //                 label: `formats/${format}`,
  //                 isActive: formatState.value === format,
  //                 onClick: () => formatState.setValue(format)
  //               });
  //             });
  //           }
  //         });
  //       }
  //     });
  //
  //     builder.Section('export-button', {
  //       children: () => {
  //         builder.Button('export', {
  //           label: 'Export Design',
  //           isLoading: loadingState.value,
  //           color: 'accent',
  //           onClick: async () => {
  //             loadingState.setValue(true);
  //             const scene = engine.scene.get();
  //             if (scene) {
  //               const mimeType =
  //                 formatState.value === 'pdf'
  //                   ? 'application/pdf'
  //                   : `image/${formatState.value}`;
  //               const blob = await engine.block.export(scene, { mimeType });
  //               console.log('Exported:', blob);
  //             }
  //             loadingState.setValue(false);
  //           }
  //         });
  //       }
  //     });
  //   }
  // );
  //
  // cesdk.ui.setPanelPosition('my-app.export-panel', 'right');
  // #endregion

  // Suppress unused variable warning
  void cesdk;
}
