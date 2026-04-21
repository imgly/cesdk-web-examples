/**
 * Dock Configuration - Photo Tools and Asset Panel
 *
 * Configure the dock to control which photo editing tools and asset libraries appear.
 *
 * ## `'ly.img.assetLibrary.dock'`
 *
 * A pre-defined component that opens a panel with asset libraries.
 *
 * - `id` - Component ID (e.g., `'ly.img.assetLibrary.dock'`)
 * - `key` - Unique identifier for this entry
 * - `label` - Translation key for the button label
 * - `icon` - Icon name (e.g., `'@imgly/Text'`, `'@imgly/Sticker'`)
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
 * Configure the dock panel layout for photo editing.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupDock(cesdk: CreativeEditorSDK): void {
  const { engine, ui } = cesdk;

  // ============================================================================
  // DOCK APPEARANCE SETTINGS
  // Configure how the dock looks
  // ============================================================================

  // #region Dock Appearance
  // Show text labels under dock icons
  engine.editor.setSetting('dock/hideLabels', false);

  // Icon size: 'normal' or 'large'
  engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // DOCK ORDER
  // Configure photo editing tools and asset libraries
  // ============================================================================

  // #region Dock Order
  ui.setComponentOrder({ in: 'ly.img.dock' }, [
    'ly.img.spacer',

    // ============================
    // Photo Editing Tools
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.crop',
      icon: '@imgly/Crop',
      label: 'Crop',
      entries: [],
      isSelected: () => ui.isPanelOpen('//ly.img.panel/inspector/crop'),
      onClick: () => {
        const page = engine.scene.getCurrentPage();
        if (page == null) return;

        if (engine.editor.getEditMode() === 'Crop') {
          engine.editor.setEditMode('Transform');
        } else {
          ui.closePanel('*');
          engine.block.select(page);
          engine.editor.setEditMode('Crop');
        }
      }
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.adjustment',
      icon: '@imgly/Adjustments',
      label: 'Adjust',
      entries: [],
      isSelected: () => ui.isPanelOpen('//ly.img.panel/inspector/adjustments'),
      onClick: () => {
        const panelId = '//ly.img.panel/inspector/adjustments';
        if (ui.isPanelOpen(panelId)) {
          ui.closePanel(panelId);
          return;
        }

        const page = engine.scene.getCurrentPage();
        if (page == null) return;

        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.filter',
      icon: '@imgly/Filter',
      label: 'Filter',
      entries: [],
      isSelected: () => ui.isPanelOpen('//ly.img.panel/inspector/filters'),
      onClick: () => {
        const panelId = '//ly.img.panel/inspector/filters';
        if (ui.isPanelOpen(panelId)) {
          ui.closePanel(panelId);
          return;
        }

        const page = engine.scene.getCurrentPage();
        if (page == null) return;

        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.effects',
      icon: '@imgly/Effects',
      label: 'Effects',
      entries: [],
      isSelected: () => ui.isPanelOpen('//ly.img.panel/inspector/effects'),
      onClick: () => {
        const panelId = '//ly.img.panel/inspector/effects';
        if (ui.isPanelOpen(panelId)) {
          ui.closePanel(panelId);
          return;
        }

        const page = engine.scene.getCurrentPage();
        if (page == null) return;

        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    },

    // ============================
    // Separator
    // ============================
    {
      id: 'ly.img.separator',
      key: 'ly.img.separator'
    },

    // ============================
    // Asset Libraries (Text, Shapes, Stickers)
    // ============================
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.text',
      icon: '@imgly/Text',
      label: 'libraries.ly.img.text.label',
      isSelected: () => {
        return ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.text'],
            title: 'libraries.ly.img.text.label'
          }
        });
      },
      onClick: () => {
        const isOpen = ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.text'],
            title: 'libraries.ly.img.text.label'
          }
        });
        if (isOpen) {
          cesdk.ui.closePanel('//ly.img.panel/assetLibrary');
        } else {
          cesdk.ui.closePanel('*');
          cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
            payload: {
              entries: ['ly.img.text'],
              title: 'libraries.ly.img.text.label'
            }
          });
        }
      }
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.vector.shape',
      icon: '@imgly/Shapes',
      label: 'libraries.ly.img.vector.shape.label',
      isSelected: () => {
        return ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.vector.shape'],
            title: 'libraries.ly.img.vector.shape.label'
          }
        });
      },
      onClick: () => {
        const isOpen = ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.vector.shape'],
            title: 'libraries.ly.img.vector.shape.label'
          }
        });
        if (isOpen) {
          cesdk.ui.closePanel('//ly.img.panel/assetLibrary');
        } else {
          cesdk.ui.closePanel('*');
          cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
            payload: {
              entries: ['ly.img.vector.shape'],
              title: 'libraries.ly.img.vector.shape.label'
            }
          });
        }
      }
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.sticker',
      icon: '@imgly/Sticker',
      label: 'libraries.ly.img.sticker.label',
      isSelected: () => {
        return ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.sticker'],
            title: 'libraries.ly.img.sticker.label'
          }
        });
      },
      onClick: () => {
        const isOpen = ui.isPanelOpen('//ly.img.panel/assetLibrary', {
          payload: {
            entries: ['ly.img.sticker'],
            title: 'libraries.ly.img.sticker.label'
          }
        });
        if (isOpen) {
          cesdk.ui.closePanel('//ly.img.panel/assetLibrary');
        } else {
          cesdk.ui.closePanel('*');
          cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
            payload: {
              entries: ['ly.img.sticker'],
              title: 'libraries.ly.img.sticker.label'
            }
          });
        }
      }
    },

    'ly.img.spacer'
  ]);
  // #endregion
}
