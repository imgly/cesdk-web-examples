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
  // #region Custom Panel - Video Export options with state management
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'panel.my-app.export-panel': 'Export Video',
  //     'resolution/720p': '720p',
  //     'resolution/1080p': '1080p',
  //     'resolution/4k': '4K',
  //     'quality/low': 'Low',
  //     'quality/medium': 'Medium',
  //     'quality/high': 'High'
  //   }
  // });
  //
  // cesdk.ui.registerPanel(
  //   'my-app.export-panel',
  //   ({ builder, engine, state }) => {
  //     // Resolution presets: 720p, 1080p, 4K
  //     const resolutionState = state<string>('resolution', '1080p');
  //     // Quality presets affecting bitrate
  //     const qualityState = state<string>('quality', 'medium');
  //     const loadingState = state<boolean>('loading', false);
  //     const progressState = state<number>('progress', 0);
  //
  //     builder.Section('resolution-section', {
  //       children: () => {
  //         builder.Heading('resolution-heading', { label: 'Resolution' });
  //         builder.ButtonGroup('resolution', {
  //           children: () => {
  //             ['720p', '1080p', '4k'].forEach((res) => {
  //               builder.Button(res, {
  //                 label: `resolution/${res}`,
  //                 isActive: resolutionState.value === res,
  //                 onClick: () => resolutionState.setValue(res)
  //               });
  //             });
  //           }
  //         });
  //       }
  //     });
  //
  //     builder.Section('quality-section', {
  //       children: () => {
  //         builder.Heading('quality-heading', { label: 'Quality' });
  //         builder.ButtonGroup('quality', {
  //           children: () => {
  //             ['low', 'medium', 'high'].forEach((q) => {
  //               builder.Button(q, {
  //                 label: `quality/${q}`,
  //                 isActive: qualityState.value === q,
  //                 onClick: () => qualityState.setValue(q)
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
  //           label: loadingState.value
  //             ? `Exporting... ${Math.round(progressState.value * 100)}%`
  //             : 'Export Video',
  //           isLoading: loadingState.value,
  //           isDisabled: loadingState.value,
  //           color: 'accent',
  //           onClick: async () => {
  //             loadingState.setValue(true);
  //             progressState.setValue(0);
  //
  //             const scene = engine.scene.get();
  //             if (scene) {
  //               // Map resolution to targetHeight
  //               const targetHeight =
  //                 resolutionState.value === '720p'
  //                   ? 720
  //                   : resolutionState.value === '4k'
  //                     ? 2160
  //                     : 1080;
  //
  //               // Map quality to videoBitrate (in bits/sec)
  //               const videoBitrate =
  //                 qualityState.value === 'low'
  //                   ? 5_000_000
  //                   : qualityState.value === 'high'
  //                     ? 20_000_000
  //                     : 10_000_000;
  //
  //               try {
  //                 const blob = await engine.block.export(scene, {
  //                   mimeType: 'video/mp4',
  //                   targetHeight,
  //                   videoBitrate,
  //                   onProgress: (rendered, encoded, total) => {
  //                     progressState.setValue(encoded / total);
  //                   }
  //                 });
  //                 console.log('Exported video:', blob);
  //
  //                 // Download the video
  //                 const url = URL.createObjectURL(blob);
  //                 const a = document.createElement('a');
  //                 a.href = url;
  //                 a.download = `video-${targetHeight}p.mp4`;
  //                 a.click();
  //                 URL.revokeObjectURL(url);
  //               } catch (error) {
  //                 console.error('Export failed:', error);
  //               }
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
