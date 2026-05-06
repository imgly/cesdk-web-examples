/**
 * Actions Configuration - Override Default Actions and Add Custom Actions
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations, and how to register custom actions for the Advanced Editor.
 *
 * ## Actions API
 *
 * Actions provide a way to extend or replace the editor's default behaviors:
 *
 * - `cesdk.actions.register(id, handler)` - Register or override an action
 * - `cesdk.actions.run(id, ...args)` - Execute an action (async, throws if not found)
 * - `cesdk.actions.get(id)` - Get action handler (returns undefined if not found)
 * - `cesdk.actions.list()` - List all registered action IDs
 *
 * ## Built-in Utility Functions
 *
 * CE.SDK provides utilities for common operations that you can use in your actions:
 *
 * - `cesdk.utils.export(options)` - Export current design to various formats
 *   - Options: mimeType, targetWidth, targetHeight, jpegQuality, pngCompressionLevel
 *   - Returns: { blobs: Blob[], options: ExportOptions }
 *
 * - `cesdk.utils.downloadFile(data, mimeType, filename?)` - Trigger browser file download
 *   - data: Blob, string, or ArrayBuffer
 *   - mimeType: MIME type (e.g., 'image/png', 'application/json')
 *   - filename: Optional filename (auto-generated if not provided)
 *
 * - `cesdk.utils.loadFile(options)` - Open browser file picker
 *   - Options: accept (file extensions), returnType ('text', 'arrayBuffer', 'objectURL')
 *   - Returns: Promise<string | ArrayBuffer | string> based on returnType
 *
 * - `cesdk.utils.localUpload(file, context)` - Create local blob URL for uploads
 *   - file: File object from input or drag-drop
 *   - context: Upload context ('image', 'video', 'audio', etc.)
 *   - Returns: Promise<string> - Blob URL that can be used with engine
 *
 * @see https://img.ly/docs/cesdk/js/actions-6ch24x
 * @see https://img.ly/docs/cesdk/js/export/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Register actions and configure the navigation bar for the Advanced Editor.
 *
 * This function sets up all custom actions needed for a professional editing workflow.
 * Override these implementations to integrate with your backend or add custom functionality.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Running actions programmatically
 * ```typescript
 * // Run built-in actions
 * await cesdk.actions.run('saveScene');
 * await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
 * await cesdk.actions.run('zoom.toPage', { page: 'current' });
 *
 * // Run custom actions with options
 * await cesdk.actions.run('exportImage'); // PNG export
 * await cesdk.actions.run('exportScene', { format: 'archive' }); // .cesdk export
 * await cesdk.actions.run('importScene', { format: 'scene' }); // Import .scene file
 * ```
 *
 * @example Customizing actions for backend integration
 * ```typescript
 * // Replace local download with API upload
 * cesdk.actions.register('saveScene', async () => {
 *   const scene = await cesdk.engine.scene.saveToString();
 *   await fetch('/api/save-scene', {
 *     method: 'POST',
 *     body: scene,
 *     headers: { 'Content-Type': 'application/json' }
 *   });
 * });
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // SAVE & EXPORT ACTIONS
  // Actions for persisting and exporting user designs
  // ============================================================================

  // #region Save Scene Action
  // Save the current scene as a .scene JSON file for later editing
  // This preserves all layers, assets, and editing state
  cesdk.actions.register('saveScene', async () => {
    const scene = await cesdk.engine.scene.saveToString();
    await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  });
  // #endregion

  // #region Export Design Action
  // Export the design as an image or PDF with custom options
  // Accepts exportOptions parameter to control format, dimensions, quality, etc.
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    const { blobs, options } = await cesdk.utils.export(exportOptions);
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // #region Export Image Action
  // Quick export action for PNG images at standard size
  // Pre-configured for common social media dimensions (1080x1080)
  cesdk.actions.register('exportImage', async () => {
    const { blobs, options } = await cesdk.utils.export({
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1080
    });
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // #region Export Scene Action
  // Export scene in two formats:
  // - 'scene': .scene JSON file (text format, no assets)
  // - 'archive': .cesdk ZIP archive (includes embedded assets)
  cesdk.actions.register('exportScene', async ({ format = 'scene' }) => {
    await cesdk.utils.downloadFile(
      format === 'archive'
        ? await cesdk.engine.scene.saveToArchive()
        : await cesdk.engine.scene.saveToString(),
      format === 'archive' ? 'application/zip' : 'text/plain;charset=UTF-8'
    );
  });
  // #endregion

  // ============================================================================
  // IMPORT ACTIONS
  // Actions for loading existing scenes and assets
  // ============================================================================

  // #region Import Scene Action
  // Import a scene from file system in two formats:
  // - 'scene': .scene JSON file (references external assets)
  // - 'archive': .cesdk ZIP archive (includes embedded assets)
  cesdk.actions.register('importScene', async ({ format = 'scene' }) => {
    if (format === 'scene') {
      // Import .scene file (JSON text)
      const scene = await cesdk.utils.loadFile({
        accept: '.scene',
        returnType: 'text'
      });
      await cesdk.engine.scene.loadFromString(scene);
    } else {
      // Import .cesdk archive file (ZIP)
      const blobURL = await cesdk.utils.loadFile({
        accept: '.zip',
        returnType: 'objectURL'
      });
      try {
        await cesdk.engine.scene.loadFromArchiveURL(blobURL);
      } finally {
        // Clean up temporary blob URL
        URL.revokeObjectURL(blobURL);
      }
    }

    // Zoom to fit the imported scene
    await cesdk.actions.run('zoom.toPage', { page: 'first' });
  });
  // #endregion

  // ============================================================================
  // UPLOAD ACTIONS
  // Actions for handling user-uploaded assets
  // ============================================================================

  // #region Upload File Action
  // Handle file uploads for images, videos, and other assets
  // Creates local blob URLs for immediate use in the editor
  cesdk.actions.register('uploadFile', (file, onProgress, context) => {
    return cesdk.utils.localUpload(file, context);
  });
  // #endregion

  // ============================================================================
  // CUSTOM ACTIONS
  // Add your own actions for custom functionality
  // ============================================================================

  // #region Share Action (Example)
  // Example: Share exported design using Web Share API
  // Falls back to download if sharing is not available
  //
  // cesdk.actions.register('share', async () => {
  //   const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
  //   const file = new File([blobs[0]], 'design.png', { type: 'image/png' });
  //
  //   if (navigator.share && navigator.canShare({ files: [file] })) {
  //     await navigator.share({
  //       files: [file],
  //       title: 'My Design',
  //       text: 'Check out my design!'
  //     });
  //   } else {
  //     await cesdk.utils.downloadFile(blobs[0], 'image/png');
  //   }
  // });
  // #endregion
}
