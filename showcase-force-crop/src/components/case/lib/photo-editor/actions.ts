/**
 * Photo Editor Actions Configuration - Override Default Actions and Add Custom Actions
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations, and how to register custom actions specifically for photo editing.
 *
 * ## Actions API
 *
 * The Actions API allows you to register custom handlers that can be triggered from
 * the UI or programmatically. Actions are the primary way to extend CE.SDK functionality.
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
 * Register actions for the photo editor.
 *
 * This function overrides default CE.SDK actions and registers custom actions
 * for photo editing workflows. Actions can be triggered from the UI (via buttons,
 * menu items) or programmatically via `cesdk.actions.run()`.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Running actions programmatically
 * ```typescript
 * // Run built-in actions
 * await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
 * await cesdk.actions.run('zoom.toPage', { page: 'current' });
 *
 * // Run custom actions
 * await cesdk.actions.run('share');
 * await cesdk.actions.run('exportImage', { targetWidth: 1920 });
 * ```
 *
 * @example Integrating with backend
 * ```typescript
 * // Override export to send to your backend
 * cesdk.actions.register('exportDesign', async (exportOptions) => {
 *   const { blobs, options } = await cesdk.utils.export(exportOptions);
 *   const formData = new FormData();
 *   formData.append('image', blobs[0], 'edited-photo.png');
 *
 *   const response = await fetch('/api/upload', {
 *     method: 'POST',
 *     body: formData
 *   });
 *
 *   const { url } = await response.json();
 *   console.log('Uploaded to:', url);
 * });
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // EXPORT ACTIONS
  // Actions for exporting the edited photo in various formats
  // ============================================================================

  // #region Export Design Action
  // Export the edited photo as PNG, JPEG, or other formats
  // This overrides the default export action to use browser download
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    // Export with specified options (mimeType, targetWidth, targetHeight, etc.)
    const { blobs, options } = await cesdk.utils.export(exportOptions);

    // Trigger browser download
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // #region Export Image Action (Custom Sizes)
  // // Export photo with custom dimensions for common social media sizes
  // cesdk.actions.register('exportImage', async ({ width = 1080, height = 1080 } = {}) => {
  //   // Export at specified dimensions
  //   const { blobs, options } = await cesdk.utils.export({
  //     mimeType: 'image/png',
  //     targetWidth: width,
  //     targetHeight: height
  //   });
  //
  //   // Download with descriptive filename
  //   await cesdk.utils.downloadFile(
  //     blobs[0],
  //     options.mimeType,
  //     `photo-${width}x${height}.png`
  //   );
  // });
  // #endregion

  // ============================================================================
  // SCENE ACTIONS
  // Actions for saving and loading scenes
  // ============================================================================

  // #region Save Scene Action
  // // Save the current scene as JSON for later editing
  // cesdk.actions.register('saveScene', async () => {
  //   // Serialize scene to JSON string
  //   const scene = await cesdk.engine.scene.saveToString();
  //
  //   // Download as .scene file
  //   await cesdk.utils.downloadFile(
  //     scene,
  //     'text/plain;charset=UTF-8',
  //     'photo-edit.scene'
  //   );
  // });
  // #endregion

  // #region Export Scene Action
  // // Export scene as .cesdk archive (includes all assets)
  // cesdk.actions.register('exportScene', async ({ format = 'scene' } = {}) => {
  //   // Export as archive (includes images/fonts) or scene (JSON only)
  //   const data = format === 'archive'
  //     ? await cesdk.engine.scene.saveToArchive()
  //     : await cesdk.engine.scene.saveToString();
  //
  //   const mimeType = format === 'archive'
  //     ? 'application/zip'
  //     : 'text/plain;charset=UTF-8';
  //
  //   const extension = format === 'archive' ? '.cesdk' : '.scene';
  //
  //   // Download with appropriate extension
  //   await cesdk.utils.downloadFile(data, mimeType, `photo-edit${extension}`);
  // });
  // #endregion

  // #region Import Scene Action
  // // Import scene from file picker
  // cesdk.actions.register('importScene', async ({ format = 'scene' } = {}) => {
  //   if (format === 'scene') {
  //     // Load JSON scene file
  //     const scene = await cesdk.utils.loadFile({
  //       accept: '.scene',
  //       returnType: 'text'
  //     });
  //     await cesdk.engine.scene.loadFromString(scene);
  //   } else {
  //     // Load .cesdk archive file
  //     const blobURL = await cesdk.utils.loadFile({
  //       accept: '.zip,.cesdk',
  //       returnType: 'objectURL'
  //     });
  //
  //     try {
  //       await cesdk.engine.scene.loadFromArchiveURL(blobURL);
  //     } finally {
  //       // Clean up blob URL to prevent memory leaks
  //       URL.revokeObjectURL(blobURL);
  //     }
  //   }
  //
  //   // Zoom to fit the loaded scene
  //   await cesdk.actions.run('zoom.toPage', { page: 'first' });
  // });
  // #endregion

  // ============================================================================
  // UPLOAD ACTIONS
  // Actions for handling file uploads
  // ============================================================================

  // #region Upload File Action
  // // Handle custom file uploads with local blob URLs
  // cesdk.actions.register('uploadFile', (file, onProgress, context) => {
  //   // Use built-in local upload utility
  //   // This creates a blob URL that can be used with the engine
  //   return cesdk.utils.localUpload(file, context);
  // });
  // #endregion

  // ============================================================================
  // SHARING ACTIONS
  // Actions for sharing edited photos
  // ============================================================================

  // #region Share Action
  // // Share edited photo using Web Share API (mobile-friendly)
  // cesdk.actions.register('share', async () => {
  //   // Export as PNG for sharing
  //   const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
  //   const file = new File([blobs[0]], 'photo.png', { type: 'image/png' });
  //
  //   // Use Web Share API if available (mobile browsers)
  //   if (navigator.share && navigator.canShare({ files: [file] })) {
  //     await navigator.share({
  //       files: [file],
  //       title: 'My Edited Photo',
  //       text: 'Check out my edited photo!'
  //     });
  //   } else {
  //     // Fallback to download if sharing not supported
  //     await cesdk.utils.downloadFile(blobs[0], 'image/png', 'photo.png');
  //   }
  // });
  // #endregion

  // ============================================================================
  // BATCH EXPORT ACTIONS
  // Actions for exporting multiple formats at once
  // ============================================================================

  // #region Batch Export Action
  // // Export photo in multiple formats for different use cases
  // cesdk.actions.register('batchExport', async () => {
  //   const formats = [
  //     { mimeType: 'image/png', name: 'high-quality.png' },
  //     { mimeType: 'image/jpeg', jpegQuality: 0.9, name: 'web-optimized.jpg' },
  //     { mimeType: 'image/jpeg', jpegQuality: 0.7, targetWidth: 1080, name: 'mobile.jpg' }
  //   ];
  //
  //   // Export all formats sequentially
  //   for (const format of formats) {
  //     const { blobs, options } = await cesdk.utils.export(format);
  //     await cesdk.utils.downloadFile(blobs[0], options.mimeType, format.name);
  //
  //     // Add small delay between downloads to prevent browser blocking
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //   }
  // });
  // #endregion
}
