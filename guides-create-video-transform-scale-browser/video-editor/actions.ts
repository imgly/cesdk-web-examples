/**
 * Actions Configuration - Override Default Actions and Add Custom Actions for Video Editor
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations, and how to register custom actions for video editing workflows.
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
 * Register actions for the video editor.
 *
 * Override default actions to integrate with your backend, or register
 * entirely custom actions for your application's needs.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Running actions programmatically
 * ```typescript
 * // Export video to MP4
 * await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
 *
 * // Export with custom video settings
 * await cesdk.actions.run('exportDesign', {
 *   mimeType: 'video/mp4',
 *   videoBitrate: 15_000_000,
 *   targetHeight: 1080
 * });
 *
 * // Add clips to timeline
 * await cesdk.actions.run('addClip');
 *
 * // Run built-in navigation actions
 * await cesdk.actions.run('zoom.toPage', { page: 'current' });
 *
 * // Run custom actions
 * await cesdk.actions.run('myCustomAction', arg1, arg2);
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // OVERRIDE DEFAULT ACTIONS
  // Replace CE.SDK's default implementations with your own
  // ============================================================================

  // #region Save Scene Action
  // Override to save scene JSON to your backend or local storage
  // cesdk.actions.register('saveScene', async () => {
  //   const scene = await cesdk.engine.scene.saveToString();
  //   await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  // });
  // #endregion

  // ============================================================================
  // VIDEO EXPORT ACTIONS
  // Handle video export with customizable settings
  // ============================================================================

  // #region Export Design Action (Video Export)
  // Override to customize video export behavior
  // This action is called by the "Export Video" button in the navigation bar
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    // Export video using cesdk.utils.export
    // Supports options: mimeType, videoCodec, videoBitrate, targetHeight, targetWidth, frameRate
    const { blobs, options } = await cesdk.utils.export(exportOptions);

    // Download the exported video
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);

    // Alternative: Upload to your backend
    // const formData = new FormData();
    // formData.append('video', blobs[0], 'video.mp4');
    // await fetch('/api/upload', { method: 'POST', body: formData });
  });
  // #endregion

  // #region Export Video Action (Alternative)
  // Custom action specifically for video export with predefined settings
  // cesdk.actions.register('exportVideo', async () => {
  //   const { blobs, options } = await cesdk.utils.export({
  //     mimeType: 'video/mp4',
  //     videoCodec: 'h264',
  //     videoBitrate: 10_000_000,
  //     targetHeight: 1080
  //   });
  //   await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  // });
  // #endregion

  // ============================================================================
  // SCENE IMPORT/EXPORT ACTIONS
  // Handle scene loading and saving for video projects
  // ============================================================================

  // #region Import Scene Action
  // Load a video scene from a file
  // cesdk.actions.register('importScene', async ({ format = 'scene' }) => {
  //   if (format === 'scene') {
  //     // Load from .scene JSON file
  //     const scene = await cesdk.utils.loadFile({
  //       accept: '.scene',
  //       returnType: 'text'
  //     });
  //     await cesdk.engine.scene.loadFromString(scene);
  //   } else {
  //     // Load from .cesdk archive file (includes assets)
  //     const blobURL = await cesdk.utils.loadFile({
  //       accept: '.zip',
  //       returnType: 'objectURL'
  //     });
  //     try {
  //       await cesdk.engine.scene.loadFromArchiveURL(blobURL);
  //     } finally {
  //       URL.revokeObjectURL(blobURL);
  //     }
  //   }
  //
  //   await cesdk.actions.run('zoom.toPage', { page: 'first' });
  // });
  // #endregion

  // #region Export Scene Action
  // Save video scene to a file
  // cesdk.actions.register('exportScene', async ({ format = 'scene' }) => {
  //   await cesdk.utils.downloadFile(
  //     format === 'archive'
  //       ? await cesdk.engine.scene.saveToArchive()
  //       : await cesdk.engine.scene.saveToString(),
  //     format === 'archive' ? 'application/zip' : 'text/plain;charset=UTF-8'
  //   );
  // });
  // #endregion

  // ============================================================================
  // TIMELINE & CLIP ACTIONS
  // Handle video clips and timeline operations
  // ============================================================================

  // #region Add Clip Action
  // Open asset library to add video or image clips to timeline
  // cesdk.actions.register('addClip', async () => {
  //   cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
  //     payload: {
  //       entries: ['ly.img.image', 'ly.img.video'],
  //       applyAssetContext: {
  //         clipType: 'clip'
  //       }
  //     }
  //   });
  // });
  // #endregion

  // #region Add Audio Track Action
  // Open asset library to add audio tracks to timeline
  // cesdk.actions.register('addAudioTrack', async () => {
  //   cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
  //     payload: {
  //       entries: ['ly.img.audio'],
  //       applyAssetContext: {
  //         clipType: 'audio'
  //       }
  //     }
  //   });
  // });
  // #endregion

  // ============================================================================
  // FILE UPLOAD ACTIONS
  // Handle local file uploads for video, audio, and images
  // ============================================================================

  // #region Upload File Action
  // Override to handle file uploads with custom logic (e.g., upload to your backend)
  // cesdk.actions.register('uploadFile', (file, onProgress, context) => {
  //   return cesdk.utils.localUpload(file, context);
  // });
  // #endregion

  // ============================================================================
  // CUSTOM ACTIONS
  // Register your own actions for custom video editing functionality
  // ============================================================================

  // #region Share Video Action
  // Share exported video using Web Share API
  // cesdk.actions.register('share', async () => {
  //   const { blobs } = await cesdk.utils.export({ mimeType: 'video/mp4' });
  //   const file = new File([blobs[0]], 'video.mp4', { type: 'video/mp4' });
  //
  //   if (navigator.share && navigator.canShare({ files: [file] })) {
  //     await navigator.share({
  //       files: [file],
  //       title: 'My Video',
  //       text: 'Check out my video!'
  //     });
  //   } else {
  //     // Fallback to download if Web Share API is not available
  //     await cesdk.utils.downloadFile(blobs[0], 'video/mp4');
  //   }
  // });
  // #endregion

  // #region Generate Video Thumbnail Action
  // Generate a thumbnail image from the current video frame
  // cesdk.actions.register('generateThumbnail', async () => {
  //   const { blobs } = await cesdk.utils.export({
  //     mimeType: 'image/png',
  //     targetHeight: 360
  //   });
  //   await cesdk.utils.downloadFile(blobs[0], 'image/png', 'thumbnail.png');
  // });
  // #endregion
}
