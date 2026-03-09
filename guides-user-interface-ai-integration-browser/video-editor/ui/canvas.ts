/**
 * Canvas Configuration - Canvas Bar and Context Menu
 *
 * Configure the canvas bar (top/bottom of canvas) and right-click context menu.
 * Different edit modes can have different menu configurations.
 *
 * ## Edit Modes
 *
 * - `'Transform'`: Default mode for selecting and moving blocks
 * - `'Text'`: Text editing mode (when editing text content)
 * - `'Crop'`: Crop mode (when cropping images/videos)
 * - `'Trim'`: Trim mode (when trimming video/audio clips)
 *
 * ## Canvas Bar Position
 *
 * The canvas bar can be positioned at `'top'` or `'bottom'` of the canvas.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-632c8e/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-menu-0d2b5b/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the canvas bar and context menu.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupCanvas(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // CANVAS BAR
  // Configure the bar at the top or bottom of the canvas
  // ============================================================================

  // #region Canvas Bar
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.bar', at: 'bottom' /* Position: 'top' | 'bottom' */ },
    [
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]
  );
  // #endregion

  // ============================================================================
  // CANVAS MENU - TRANSFORM MODE
  // Context menu when blocks are selected in default mode
  // ============================================================================

  // #region Canvas Menu - Transform Mode
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
    [
      // ============================
      // Group Navigation
      // ============================
      'ly.img.group.enter.canvasMenu',
      'ly.img.group.select.canvasMenu',

      // ============================
      // Page Ordering
      // ============================
      'ly.img.page.moveUp.canvasMenu',
      'ly.img.page.moveDown.canvasMenu',
      'ly.img.separator',

      // ============================
      // Content Editing
      // ============================
      'ly.img.text.edit.canvasMenu',
      'ly.img.replace.canvasMenu',
      'ly.img.separator',

      // ============================
      // Layer Ordering
      // ============================
      'ly.img.bringForward.canvasMenu',
      'ly.img.sendBackward.canvasMenu',
      'ly.img.separator',

      // ============================
      // Common Operations
      // ============================
      'ly.img.duplicate.canvasMenu',
      'ly.img.delete.canvasMenu',
      'ly.img.separator',
      'ly.img.options.canvasMenu'
    ]
  );
  // #endregion

  // ============================================================================
  // CANVAS MENU - TEXT MODE
  // Context menu when editing text content
  // ============================================================================

  // #region Canvas Menu - Text Mode
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
    [
      'ly.img.text.color.canvasMenu',
      'ly.img.separator',
      'ly.img.text.bold.canvasMenu',
      'ly.img.text.italic.canvasMenu',
      'ly.img.separator',
      'ly.img.text.variables.canvasMenu'
    ]
  );
  // #endregion
}
