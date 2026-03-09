import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Join and Arrange Video Clips Guide
 *
 * Demonstrates combining multiple video clips into sequences:
 * - Creating video scenes and tracks
 * - Adding clips to tracks for sequential playback
 * - Reordering clips within a track
 * - Controlling clip timing with time offsets
 * - Creating multi-track compositions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page duration to accommodate all clips (15 seconds total)
    engine.block.setDuration(page, 15);

    // Sample video URL for the demonstration
    const videoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

    // Create video clips using the addVideo helper method
    // Each clip is sized to fill the canvas (1920x1080 is standard video resolution)
    const clipA = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 5, timeOffset: 0 }
    });

    const clipB = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 5, timeOffset: 5 }
    });

    const clipC = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 5, timeOffset: 10 }
    });

    // Create a track and add it to the page
    // Tracks organize clips for sequential playback on the timeline
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    // Add clips to the track
    engine.block.appendChild(track, clipA);
    engine.block.appendChild(track, clipB);
    engine.block.appendChild(track, clipC);

    // Resize all track children to fill the page dimensions
    engine.block.fillParent(track);

    // Query track children to verify order
    const trackClips = engine.block.getChildren(track);
    // eslint-disable-next-line no-console
    console.log('Track clip count:', trackClips.length, 'clips');

    // Set durations for each clip
    engine.block.setDuration(clipA, 5);
    engine.block.setDuration(clipB, 5);
    engine.block.setDuration(clipC, 5);

    // Set time offsets to position clips sequentially on the timeline
    engine.block.setTimeOffset(clipA, 0);
    engine.block.setTimeOffset(clipB, 5);
    engine.block.setTimeOffset(clipC, 10);

    // eslint-disable-next-line no-console
    console.log('Track offsets set: Clip A: 0s, Clip B: 5s, Clip C: 10s');

    // Reorder clips: move Clip C to the beginning (index 0)
    // This demonstrates using insertChild for precise positioning
    engine.block.insertChild(track, clipC, 0);

    // After reordering, update time offsets to reflect the new sequence
    engine.block.setTimeOffset(clipC, 0);
    engine.block.setTimeOffset(clipA, 5);
    engine.block.setTimeOffset(clipB, 10);

    // eslint-disable-next-line no-console
    console.log('After reorder - updated offsets: C=0s, A=5s, B=10s');

    // Get all clips in the track to verify arrangement
    const finalClips = engine.block.getChildren(track);
    // eslint-disable-next-line no-console
    console.log('Final track arrangement:');
    finalClips.forEach((clipId, index) => {
      const offset = engine.block.getTimeOffset(clipId);
      const duration = engine.block.getDuration(clipId);
      // eslint-disable-next-line no-console
      console.log(
        `  Clip ${index + 1}: offset=${offset}s, duration=${duration}s`
      );
    });

    // Create a second track for layered compositions
    // Track order determines z-index: last track renders on top
    const overlayTrack = engine.block.create('track');
    engine.block.appendChild(page, overlayTrack);

    // Create an overlay clip for picture-in-picture effect (1/4 size)
    const overlayClip = await engine.block.addVideo(
      videoUrl,
      1920 / 4,
      1080 / 4,
      {
        timeline: { duration: 5, timeOffset: 2 }
      }
    );
    engine.block.appendChild(overlayTrack, overlayClip);

    // Position overlay in bottom-right corner with padding
    engine.block.setPositionX(overlayClip, 1920 - 1920 / 4 - 40);
    engine.block.setPositionY(overlayClip, 1080 - 1080 / 4 - 40);

    // eslint-disable-next-line no-console
    console.log('Multi-track composition created with overlay starting at 2s');

    // Select the first clip in the main track to show timeline controls
    engine.block.select(clipC);

    // Seek to 2.5s to show both main clip and overlay visible
    // (overlay starts at 2s, so 2.5s shows both elements)
    engine.block.setPlaybackTime(page, 2.5);

    // eslint-disable-next-line no-console
    console.log(
      'Join and Arrange guide initialized. Use timeline to view clip arrangement.'
    );
  }
}

export default Example;
