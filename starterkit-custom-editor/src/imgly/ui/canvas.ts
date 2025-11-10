/**
 * Canvas Configuration
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-632c8e/
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/canvas-menu-0d2b5b/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupCanvas(cesdk: CreativeEditorSDK): void {
  // #region Canvas bar configuration
  // Configure canvas bar order top
  // cesdk.ui.setCanvasBarOrder(
  //   [
  //     'ly.img.settings.canvasBar',
  //     'ly.img.spacer',
  //     'ly.img.page.add.canvasBar',
  //     'ly.img.spacer'
  //   ],
  //   'top'
  // );
  // Configure canvas bar order top bottom
  // cesdk.ui.setCanvasBarOrder(
  //   [
  //     // 'ly.img.settings.canvasBar',
  //     // 'ly.img.spacer',
  //     // 'ly.img.page.add.canvasBar',
  //     // 'ly.img.spacer'
  //   ],
  //   'bottom'
  // );
  // #endregion
  // #region Canvas menu - Transform mode
  // Configure canvas menu order top - Transform mode
  // cesdk.ui.setCanvasMenuOrder(
  //   [
  //     // 'ly.img.group.enter.canvasMenu',
  //     // 'ly.img.group.select.canvasMenu',
  //     // 'ly.img.page.moveUp.canvasMenu',
  //     // 'ly.img.page.moveDown.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.text.edit.canvasMenu',
  //     // 'ly.img.replace.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.placeholder.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.bringForward.canvasMenu',
  //     // 'ly.img.sendBackward.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.duplicate.canvasMenu',
  //     // 'ly.img.delete.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.options.canvasMenu'
  //   ],
  //   { editMode: 'Transform' }
  // );
  // #endregion
  // #region Canvas menu - Text mode
  // Configure canvas menu order top - Text mode
  // cesdk.ui.setCanvasMenuOrder(
  //   [
  //     // 'ly.img.text.color.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.text.bold.canvasMenu',
  //     // 'ly.img.text.italic.canvasMenu',
  //     // 'ly.img.separator',
  //     // 'ly.img.text.variables.canvasMenu'
  //   ],
  //   { editMode: 'Text' }
  // );
  // #endregion
  // #region Canvas menu - Crop mode
  // Configure canvas menu order top - Crop mode
  // cesdk.ui.setCanvasMenuOrder(
  //   [
  //     // Crop-specific operations would go here
  //   ],
  //   { editMode: 'Crop' }
  // );
  // #endregion
  // #region Canvas menu - Trim mode
  // Configure canvas menu order top - Trim mode
  // cesdk.ui.setCanvasMenuOrder(
  //   [
  //     // Trim-specific operations would go heres
  //   ],
  //   { editMode: 'Trim' }
  // );
  // #endregion
}
