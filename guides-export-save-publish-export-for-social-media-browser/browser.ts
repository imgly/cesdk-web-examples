import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export for Social Media Guide
 *
 * This example demonstrates:
 * - Creating a vertical video scene (9:16) for Instagram Reels, TikTok, YouTube Shorts
 * - Exporting videos with resolution, framerate, and bitrate settings
 * - Tracking video export progress
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Create a vertical video scene (9:16) for Instagram Reels, TikTok, YouTube Shorts
    await cesdk.createVideoScene({
      width: 1080,
      height: 1920,
      unit: 'Pixel'
    });

    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Add a video clip that fills the vertical frame
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const videoBlock = await engine.block.addVideo(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      pageWidth,
      pageHeight
    );
    engine.block.fillParent(videoBlock);

    // Export video for Instagram Reels / TikTok / YouTube Shorts (9:16)
    const exportVideo = async () => {
      cesdk.ui.showNotification({
        message: 'Exporting video...',
        type: 'info'
      });

      const currentPage = engine.scene.getCurrentPage();
      if (!currentPage) return;

      const videoBlob = await engine.block.exportVideo(currentPage, {
        mimeType: 'video/mp4',
        targetWidth: 1080,
        targetHeight: 1920,
        framerate: 30,
        videoBitrate: 8_000_000, // 8 Mbps
        onProgress: (renderedFrames, encodedFrames, totalFrames) => {
          const percent = Math.round((encodedFrames / totalFrames) * 100);
          console.log(
            `Export progress: ${percent}% (${encodedFrames}/${totalFrames} frames)`
          );
        }
      });

      await cesdk.utils.downloadFile(videoBlob, 'video/mp4');
      cesdk.ui.showNotification({
        message: `Video exported: ${(videoBlob.size / 1024 / 1024).toFixed(1)} MB (1080×1920)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export button
    cesdk.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportVideo,
        key: 'export-video',
        label: 'Export Video',
        icon: '@imgly/Video',
        variant: 'plain',
        color: 'accent'
      }
    ]);
  }
}

export default Example;
