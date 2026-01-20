import type CreativeEngine from '@cesdk/cesdk-js/cesdk-engine';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

// ===== Handle Different Video Sources =====
// Helper function to create a scene from a blob (e.g., file upload)
// This pattern is useful when users upload video files via <input type="file">
async function createSceneFromBlob(
  engine: CreativeEngine,
  blob: Blob
): Promise<number> {
  const objectURL = URL.createObjectURL(blob);
  const scene = await engine.scene.createFromVideo(objectURL);
  // Note: Don't revoke the URL immediately - the engine needs it for rendering
  // Only revoke when the scene is no longer needed
  return scene;
}

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // ===== Create a Scene from a Video URL =====
    // Video URL to create the scene from
    const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a scene from the video
    // The scene dimensions match the video resolution
    // Timeline mode is automatically enabled
    const scene = await engine.scene.createFromVideo(videoUrl);

    // ===== Work with the Video Block =====
    // Find the video block that was created
    // The video is placed inside a graphic block
    const graphicBlocks = engine.block.findByType('graphic');
    const videoBlock = graphicBlocks[0];

    // Modify video block properties
    // For example, adjust opacity
    engine.block.setOpacity(videoBlock, 0.95);

    // ===== Control Video Playback =====
    // Get the video duration
    const duration = engine.block.getDuration(scene);

    // Set playback position to 2 seconds
    const page = engine.block.findByType('page')[0];
    engine.block.setPlaybackTime(page, 2);

    // Start video playback
    // engine.block.setPlaying(scene, true);

    // Zoom to show the video
    await engine.scene.zoomToBlock(page);
  }
}

export default Example;
