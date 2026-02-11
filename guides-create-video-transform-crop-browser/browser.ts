import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default and demo asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Create a video scene - automatically sets up page and track structure
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 720, height: 1280, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page from the scene
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Add a video using the convenience API - this handles track creation automatically
    const videoUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';
    const videoBlock = await engine.block.addVideo(videoUri, 720, 1280);

    // Append the video block to the page (for video scenes, this adds to the track)
    engine.block.appendChild(page, videoBlock);

    // Set video duration on the timeline
    engine.block.setDuration(videoBlock, 10);

    // Get the fill to force load the video resource
    const videoFill = engine.block.getFill(videoBlock);
    await engine.block.forceLoadAVResource(videoFill);

    // Verify the block supports cropping before applying crop operations
    const supportsCrop = engine.block.supportsCrop(videoBlock);
    console.log('Block supports crop:', supportsCrop);

    // Set content fill mode to 'Crop' for manual crop control
    // This enables the crop transform APIs to take effect
    engine.block.setContentFillMode(videoBlock, 'Crop');

    // Scale the video content within its frame using uniform scale ratio
    // Values greater than 1.0 zoom in, values less than 1.0 zoom out
    engine.block.setCropScaleRatio(videoBlock, 1.1);

    // Pan the video content within the crop frame
    // Translation values are percentages of the crop frame dimensions
    // Positive X moves content right, positive Y moves content down
    engine.block.setCropTranslationX(videoBlock, 0.0);
    engine.block.setCropTranslationY(videoBlock, 0.0);

    // Rotate the video content within its frame
    // Rotation is specified in radians (Math.PI = 180 degrees)
    engine.block.setCropRotation(videoBlock, Math.PI / 90); // 2 degrees

    // Retrieve the current crop state
    const scaleRatio = engine.block.getCropScaleRatio(videoBlock);
    const translationX = engine.block.getCropTranslationX(videoBlock);
    const translationY = engine.block.getCropTranslationY(videoBlock);
    const rotation = engine.block.getCropRotation(videoBlock);

    console.log('Crop scale ratio:', scaleRatio);
    console.log('Crop translation X:', translationX);
    console.log('Crop translation Y:', translationY);
    console.log('Crop rotation (radians):', rotation);

    // Adjust crop to ensure content fills the frame without letterboxing
    // The minScaleRatio parameter sets the minimum allowed scale
    // This corrects any black bars caused by rotation or translation
    engine.block.adjustCropToFillFrame(videoBlock, 1.1);
    const finalScale = engine.block.getCropScaleRatio(videoBlock);
    console.log('Adjusted scale ratio:', finalScale);

    // Flip the video content within its crop frame
    // This flips the content, not the entire block
    engine.block.flipCropHorizontal(videoBlock);

    // Lock the crop aspect ratio during interactive editing
    // When locked, crop handles maintain the current aspect ratio
    engine.block.setCropAspectRatioLocked(videoBlock, true);
    const isLocked = engine.block.isCropAspectRatioLocked(videoBlock);
    console.log('Crop aspect ratio locked:', isLocked);

    // Reset crop to default state (removes all crop transformations)
    engine.block.resetCrop(videoBlock);
    // Re-apply a subtle zoom to demonstrate crop is working
    engine.block.setCropScaleRatio(videoBlock, 1.05);

    // Select the video block to show it in the UI
    engine.block.select(videoBlock);

    // Set playback time to show video content
    engine.block.setPlaybackTime(page, 2.0);

    // Zoom to the video block for better visibility of the crop effect
    cesdk.engine.scene.zoomToBlock(videoBlock, 0.5, 0.5, 0.8);
  }
}

export default Example;
