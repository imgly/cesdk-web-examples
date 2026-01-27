import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Compress Guide
 *
 * Demonstrates compression during export:
 * - PNG lossless compression levels
 * - JPEG lossy quality settings
 * - WebP quality settings
 * - Target dimension scaling
 * - Video compression with bitrate control
 * - Navigation bar dropdown with export options
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Video mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Load a video template scene for demonstration
    await cesdk.loadFromURL(
      'https://cdn.img.ly/assets/demo/v2/ly.img.video.template/templates/milli-surf-school.scene'
    );

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    if (page == null) throw new Error('No page found');

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // PNG uses lossless compression - level 0-9
    // Higher levels = smaller files, slower encoding
    // Quality is identical at all levels
    const exportPngLevel9 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9
      });
      downloadBlob(blob, 'export-png-level9.png');
      cesdk.ui.showNotification({
        message: `PNG Level 9: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportPngLevel5 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 5
      });
      downloadBlob(blob, 'export-png-level5.png');
      cesdk.ui.showNotification({
        message: `PNG Level 5: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // JPEG uses lossy compression - quality 0-1
    // Lower values = smaller files, more artifacts
    const exportJpeg90 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      downloadBlob(blob, 'export-jpeg-90.jpg');
      cesdk.ui.showNotification({
        message: `JPEG 90%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportJpeg60 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.6
      });
      downloadBlob(blob, 'export-jpeg-60.jpg');
      cesdk.ui.showNotification({
        message: `JPEG 60%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // WebP supports both lossless (1.0) and lossy (<1.0) modes
    // Typically 20-30% smaller than JPEG at equivalent quality
    const exportWebp90 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 0.9
      });
      downloadBlob(blob, 'export-webp-90.webp');
      cesdk.ui.showNotification({
        message: `WebP 90%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    const exportWebp60 = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 0.6
      });
      downloadBlob(blob, 'export-webp-60.webp');
      cesdk.ui.showNotification({
        message: `WebP 60%: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // Combine compression with dimension scaling
    // Useful for creating thumbnails or social media previews
    const exportScaled = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 6,
        targetWidth: 1200,
        targetHeight: 630
      });
      downloadBlob(blob, 'export-scaled-1200x630.png');
      cesdk.ui.showNotification({
        message: `Scaled 1200×630: ${(blob.size / 1024).toFixed(0)} KB`,
        type: 'success'
      });
    };

    // Video export with web-optimized bitrate (720p, 2 Mbps)
    const exportVideoWeb = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 2_000_000,
        audioBitrate: 128_000,
        framerate: 30,
        targetWidth: 1280,
        targetHeight: 720
      });
      downloadBlob(blob, 'export-web-720p.mp4');
      cesdk.ui.showNotification({
        message: `Video 720p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };

    // Video export with HD bitrate (1080p, 8 Mbps)
    const exportVideoHD = async () => {
      const blob = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4',
        videoBitrate: 8_000_000,
        audioBitrate: 192_000,
        framerate: 30,
        targetWidth: 1920,
        targetHeight: 1080
      });
      downloadBlob(blob, 'export-hd-1080p.mp4');
      cesdk.ui.showNotification({
        message: `Video 1080p: ${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'success'
      });
    };

    // Configure navigation bar with export dropdown
    cesdk.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      // Actions dropdown with all export options
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          // PNG exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png-9',
            label: 'PNG (Level 9 - Smallest)',
            icon: '@imgly/Save',
            onClick: exportPngLevel9
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png-5',
            label: 'PNG (Level 5 - Balanced)',
            icon: '@imgly/Save',
            onClick: exportPngLevel5
          },
          // JPEG exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg-90',
            label: 'JPEG (90% Quality)',
            icon: '@imgly/Save',
            onClick: exportJpeg90
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg-60',
            label: 'JPEG (60% Quality)',
            icon: '@imgly/Save',
            onClick: exportJpeg60
          },
          // WebP exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webp-90',
            label: 'WebP (90% Quality)',
            icon: '@imgly/Save',
            onClick: exportWebp90
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webp-60',
            label: 'WebP (60% Quality)',
            icon: '@imgly/Save',
            onClick: exportWebp60
          },
          // Scaled export
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-scaled',
            label: 'Scaled (1200×630)',
            icon: '@imgly/Save',
            onClick: exportScaled
          },
          // Video exports
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-video-web',
            label: 'Video 720p (2 Mbps)',
            icon: '@imgly/Video',
            onClick: exportVideoWeb
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-video-hd',
            label: 'Video 1080p (8 Mbps)',
            icon: '@imgly/Video',
            onClick: exportVideoHD
          }
        ]
      }
    ]);

    // eslint-disable-next-line no-console
    console.log('Compression guide initialized. Use the dropdown menu to export in different formats.');
  }
}

export default Example;
