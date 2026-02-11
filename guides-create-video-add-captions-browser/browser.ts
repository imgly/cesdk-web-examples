import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Add Captions Guide
 *
 * Demonstrates adding synchronized captions to video projects:
 * - Importing captions from SRT/VTT files
 * - Creating and styling captions programmatically
 * - Applying caption presets
 * - Controlling caption timing and positioning
 * - Adding animations to captions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features including captions
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Create a video scene for caption overlay
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    engine.block.setDuration(page, 40);

    // Add a video clip as the base content
    const videoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoClip = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 40, timeOffset: 0 }
    });
    engine.block.appendChild(track, videoClip);
    engine.block.fillParent(track);

    // Import captions from SRT file
    // createCaptionsFromURI parses SRT/VTT and creates caption blocks with timing
    const captionSrtUrl = 'https://img.ly/static/examples/captions.srt';
    const captionBlocks = await engine.block.createCaptionsFromURI(
      captionSrtUrl
    );

    // eslint-disable-next-line no-console
    console.log(`Imported ${captionBlocks.length} captions from SRT file`);

    // Adjust caption timing to start at the beginning of the video
    // The SRT file may have different timing, so we reset to start at 0
    let currentOffset = 0;
    for (const captionId of captionBlocks) {
      const duration = engine.block.getDuration(captionId);
      engine.block.setTimeOffset(captionId, currentOffset);
      currentOffset += duration;
    }

    // Create a caption track and add captions to it
    // Caption tracks organize captions in the timeline
    const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');
    engine.block.appendChild(page, captionTrack);

    // Add each caption block to the track
    for (const captionId of captionBlocks) {
      engine.block.appendChild(captionTrack, captionId);
    }

    // eslint-disable-next-line no-console
    console.log(`Caption track created with ${captionBlocks.length} captions`);

    // Apply a caption preset for consistent styling
    // Caption presets provide pre-configured styles (fonts, colors, backgrounds)
    const captionPresetsSourceId = 'ly.img.captionPresets';
    const comicPresetId = '//ly.img.captionPresets/comic';

    // Fetch the preset asset
    const comicPreset = await engine.asset.fetchAsset(
      captionPresetsSourceId,
      comicPresetId
    );

    // Apply preset to the first caption (styling syncs across all captions)
    if (comicPreset && captionBlocks.length > 0) {
      await engine.asset.applyToBlock(
        captionPresetsSourceId,
        comicPreset,
        captionBlocks[0]
      );
      // eslint-disable-next-line no-console
      console.log('Applied comic preset to captions');
    }

    // Position captions at the bottom of the video frame
    // Caption position and size sync across all captions, so we only set it once
    if (captionBlocks.length > 0) {
      const firstCaption = captionBlocks[0];

      // Use percentage-based positioning for responsive layout
      engine.block.setPositionXMode(firstCaption, 'Percent');
      engine.block.setPositionYMode(firstCaption, 'Percent');
      engine.block.setWidthMode(firstCaption, 'Percent');
      engine.block.setHeightMode(firstCaption, 'Percent');

      // Position at bottom center with padding
      engine.block.setPositionX(firstCaption, 0.05); // 5% from left
      engine.block.setPositionY(firstCaption, 0.8); // 80% from top (near bottom)
      engine.block.setWidth(firstCaption, 0.9); // 90% width
      engine.block.setHeight(firstCaption, 0.15); // 15% height
    }

    // Modify a specific caption's text and timing
    if (captionBlocks.length > 0) {
      const firstCaption = captionBlocks[0];

      // Get current text
      const currentText = engine.block.getString(firstCaption, 'caption/text');
      // eslint-disable-next-line no-console
      console.log('First caption text:', currentText);

      // Get timing info
      const offset = engine.block.getTimeOffset(firstCaption);
      const duration = engine.block.getDuration(firstCaption);
      // eslint-disable-next-line no-console
      console.log(`First caption: offset=${offset}s, duration=${duration}s`);
    }

    // Add fade-in animation to the first caption
    if (captionBlocks.length > 0) {
      const firstCaption = captionBlocks[0];

      // Create and apply entry animation
      const fadeIn = engine.block.createAnimation('fade');
      engine.block.setDuration(fadeIn, 0.3);
      engine.block.setInAnimation(firstCaption, fadeIn);

      // eslint-disable-next-line no-console
      console.log('Added fade-in animation to first caption');
    }

    // Select the first caption to show it in the inspector
    if (captionBlocks.length > 0) {
      engine.block.select(captionBlocks[0]);
    }

    // Seek to show the first caption at 1 second
    engine.block.setPlaybackTime(page, 1);

    // Open the caption inspector panel
    cesdk.ui.openPanel('//ly.img.panel/inspector/caption');

    // eslint-disable-next-line no-console
    console.log(
      'Add Captions guide initialized. Captions imported and styled.'
    );
  }
}

export default Example;
