/**
 * Actions Configuration - Override Default Actions and Add Custom Actions
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations for the Design Editor starterkit.
 *
 * ## Actions API
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
 * Register actions and configure the navigation bar.
 *
 * Override default actions to integrate with your backend, cloud storage,
 * or customize the export/import behavior for your application's needs.
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
 * // Run custom actions
 * await cesdk.actions.run('exportImage');  // Custom PNG export
 * await cesdk.actions.run('exportScene', { format: 'archive' });
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // OVERRIDE DEFAULT ACTIONS
  // Replace CE.SDK's default implementations with your own
  // ============================================================================

  // #region Save Scene Action
  // Save the current scene as a .scene JSON file
  // This preserves the entire scene structure for later editing
  cesdk.actions.register('saveScene', async () => {
    const scene = await cesdk.engine.scene.saveToString();
    await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  });
  // #endregion

  // #region Export Design Action
  // Generic export action that handles various export formats
  // Used by the SDK's built-in export UI components
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    const { blobs, options } = await cesdk.utils.export(exportOptions);
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // #region Import Scene Action
  // Import a scene from a .scene JSON file or .cesdk archive
  // Supports both formats and resets the zoom to the first page
  cesdk.actions.register('importScene', async ({ format = 'scene' }) => {
    if (format === 'scene') {
      // Import from .scene JSON file
      const scene = await cesdk.utils.loadFile({
        accept: '.scene',
        returnType: 'text'
      });
      await cesdk.engine.scene.loadFromString(scene);
    } else {
      // Import from .cesdk archive (includes embedded assets)
      const blobURL = await cesdk.utils.loadFile({
        accept: '.zip',
        returnType: 'objectURL'
      });
      try {
        await cesdk.engine.scene.loadFromArchiveURL(blobURL);
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    }

    // Reset zoom to show the first page after import
    await cesdk.actions.run('zoom.toPage', { page: 'first' });
  });
  // #endregion

  // #region Export Scene Action
  // Export the scene in different formats
  // - 'scene': JSON text file for lightweight sharing
  // - 'archive': .cesdk zip archive with embedded assets
  cesdk.actions.register('exportScene', async ({ format = 'scene' }) => {
    await cesdk.utils.downloadFile(
      format === 'archive'
        ? await cesdk.engine.scene.saveToArchive()
        : await cesdk.engine.scene.saveToString(),
      format === 'archive' ? 'application/zip' : 'text/plain;charset=UTF-8'
    );
  });
  // #endregion

  // #region Upload File Action
  // Handle local file uploads by creating blob URLs
  // This integrates with CE.SDK's upload asset sources
  cesdk.actions.register('uploadFile', (file, onProgress, context) => {
    return cesdk.utils.localUpload(file, context);
  });
  // #endregion

  // #region Export Image Action
  // Export the current design as a PNG image at 1080x1080 resolution
  // Customize targetWidth/targetHeight for different output sizes
  cesdk.actions.register('exportImage', async () => {
    const { blobs, options } = await cesdk.utils.export({
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1080
    });
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // ============================================================================
  // CUSTOM ACTIONS
  // Register your own actions for custom functionality
  // ============================================================================

  // #region Share Action Example
  // Example: Share design using Web Share API (mobile/modern browsers)
  // Falls back to download if sharing is not supported
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

  // #region Backend Integration Example
  // Example: Upload design to your backend server
  //
  // cesdk.actions.register('saveToBackend', async () => {
  //   const scene = await cesdk.engine.scene.saveToString();
  //   const response = await fetch('/api/designs', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ scene })
  //   });
  //   const { id } = await response.json();
  //   console.log('Design saved with ID:', id);
  // });
  // #endregion
}
