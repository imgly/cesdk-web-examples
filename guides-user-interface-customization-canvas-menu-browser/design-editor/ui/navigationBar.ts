/**
 * Navigation Bar Configuration - Top Bar with Actions and Controls
 *
 * Configure the navigation bar order and behavior. Override onClick handlers
 * to integrate with your application's navigation and save logic.
 *
 * ## Available Components
 *
 * **Navigation:**
 * - `'ly.img.back.navigationBar'` - Back button (requires onClick handler)
 * - `'ly.img.close.navigationBar'` - Close button (requires onClick handler)
 *
 * **History & Layout:**
 * - `'ly.img.undoRedo.navigationBar'` - Undo/Redo buttons
 * - `'ly.img.pageResize.navigationBar'` - Page resize control
 * - `'ly.img.title.navigationBar'` - Document title display
 * - `'ly.img.zoom.navigationBar'` - Zoom controls
 * - `'ly.img.preview.navigationBar'` - Preview button
 *
 * **Actions (top-level or as children of actions dropdown):**
 * - `'ly.img.actions.navigationBar'` - Actions dropdown container
 * - `'ly.img.save.navigationBar'` - Save action
 * - `'ly.img.saveScene.navigationBar'` - Save scene action
 * - `'ly.img.load.navigationBar'` - Load action
 * - `'ly.img.loadArchive.navigationBar'` - Load archive action
 * - `'ly.img.download.navigationBar'` - Download action
 * - `'ly.img.share.navigationBar'` - Share action
 * - `'ly.img.shareScene.navigationBar'` - Share scene action
 *
 * **Export:**
 * - `'ly.img.export.navigationBar'` - Generic export
 * - `'ly.img.exportImage.navigationBar'` - Export as image
 * - `'ly.img.exportVideo.navigationBar'` - Export as video
 * - `'ly.img.exportPDF.navigationBar'` - Export as PDF
 * - `'ly.img.exportScene.navigationBar'` - Export scene
 * - `'ly.img.exportArchive.navigationBar'` - Export archive
 *
 * **Import:**
 * - `'ly.img.importScene.navigationBar'` - Import scene
 * - `'ly.img.importArchive.navigationBar'` - Import archive
 *
 * **Layout:**
 * - `'ly.img.spacer'` - Flexible spacer
 * - `'ly.img.separator'` - Visual separator
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/navigation-bar-4e5d39/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the navigation bar layout and behavior.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupNavigationBar(cesdk: CreativeEditorSDK): void {
  // #region Navigation Bar Order
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    // ============================
    // Left Section - History
    // ============================
    'ly.img.undoRedo.navigationBar',
    'ly.img.pageResize.navigationBar',

    // ============================
    // Center Section - Title
    // ============================
    'ly.img.spacer',
    'ly.img.title.navigationBar',
    'ly.img.spacer',

    // ============================
    // Right Section - Actions
    // ============================
    'ly.img.zoom.navigationBar',
    'ly.img.preview.navigationBar'
  ]);
  // #endregion
}
