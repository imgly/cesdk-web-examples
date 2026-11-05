/**
 * Dock Configuration - Asset Panel
 *
 * Configure the asset dock to control which asset libraries appear.
 * The dock can be positioned at `'left'`, `'right'`, or `'bottom'` using the `at` option.
 *
 * ## `'ly.img.assetLibrary.dock'`
 *
 * A pre-defined component that opens a panel with asset libraries.
 *
 * - `id` - Component ID (e.g., `'ly.img.assetLibrary.dock'`)
 * - `key` - Unique identifier for this entry
 * - `label` - Translation key for the button label
 * - `icon` - Icon name (e.g., `'@imgly/Template'`, `'@imgly/Image'`)
 * - `entries` - Array of asset source IDs to display
 * - `onClick` - Custom click handler (overrides default behavior)
 * - `isSelected` - Boolean or function to control selected state
 * - `isDisabled` - Boolean or function to control disabled state
 * - `size` - Button size: `'normal'` | `'large'`
 * - `variant` - Button variant: `'regular'` | `'plain'`
 * - `color` - Button color: `'accent'` | `'danger'`
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
 * @see https://img.ly/docs/cesdk/js/user-interface/appearance/icons-679e32/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the dock panel layout.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupDock(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // DOCK APPEARANCE SETTINGS
  // Configure how the dock looks
  // ============================================================================

  // #region Dock Appearance
  // Show text labels under dock icons
  cesdk.engine.editor.setSetting('dock/hideLabels', false);

  // Icon size: 'normal' or 'large'
  cesdk.engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // DOCK ORDER
  // Configure which asset libraries appear and in what order
  // ============================================================================

  // #region Dock Order
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    // ============================
    // Templates
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.templates',
      icon: '@imgly/Template',
      label: 'libraries.ly.img.templates.label',
      entries: ['ly.img.templates']
    },
    {
      id: 'ly.img.separator',
      key: 'ly.img.separator'
    },

    // ============================
    // Combined Elements
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.elements',
      icon: '@imgly/Library',
      label: 'component.library.elements',
      entries: [
        'ly.img.image',
        'ly.img.text',
        'ly.img.vector.shape',
        'ly.img.sticker'
      ]
    },

    // ============================
    // Uploads
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.upload',
      icon: '@imgly/Upload',
      label: 'libraries.ly.img.upload.label',
      entries: ['ly.img.upload']
    },

    // ============================
    // Individual Asset Types
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.image',
      icon: '@imgly/Image',
      label: 'libraries.ly.img.image.label',
      entries: ['ly.img.image', 'ly.img.image.upload']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.text',
      icon: '@imgly/Text',
      label: 'libraries.ly.img.text.label',
      entries: ['ly.img.text']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.vector.shape',
      icon: '@imgly/Shapes',
      label: 'libraries.ly.img.vector.shape.label',
      entries: ['ly.img.vector.shape']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.sticker',
      icon: '@imgly/Sticker',
      label: 'libraries.ly.img.sticker.label',
      entries: ['ly.img.sticker']
    },

    // ============================
    // Layers & Pages
    // ============================
    // The spacer takes the leftover room, so this entry sits at the bottom of
    // the dock. It is the last one the config declares, so anything added
    // afterwards -- a plugin's own dock button -- lands below it unless that
    // caller says where it goes: `insertOrderComponent` takes a `before`.
    {
      id: 'ly.img.spacer',
      key: 'ly.img.spacer'
    },
    {
      id: 'ly.img.separator',
      key: 'ly.img.separator.layers'
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.layerList',
      icon: '@imgly/Layers',
      label: 'component.layerList',
      entries: [],
      isSelected: () => cesdk.ui.isPanelOpen('//ly.img.panel/layers'),
      onClick: () => {
        if (cesdk.ui.isPanelOpen('//ly.img.panel/layers')) {
          cesdk.ui.closePanel('//ly.img.panel/layers');
        } else {
          cesdk.ui.openPanel('//ly.img.panel/layers');
        }
      }
    }
  ]);
  // #endregion
}
