import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
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
 * CE.SDK Plugin: Apply Transitions Guide
 *
 * Demonstrates clip-to-clip transitions in video compositions:
 * - Checking transition support on clips
 * - Creating and assigning transitions between adjacent clips
 * - Observing the timeline overlap a transition introduces
 * - Configuring per-type properties (direction, color, morph)
 * - Reading back, replacing, and removing transitions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
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
        include: ['ly.img.page.presets.video.*']
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Build a sequence of four clips on a single track
    const videoUrls = [
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-tony-schnagl-5528015.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-7108801.mp4'
    ];

    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const clips: number[] = [];
    for (const url of videoUrls) {
      const clip = await engine.block.addVideo(url, 1280, 720, {
        timeline: { duration: 4 }
      });
      engine.block.appendChild(track, clip);
      clips.push(clip);
    }
    engine.block.fillParent(track);

    const [clipA, clipB, clipC] = clips;

    // Individual clips placed directly in a video track support transitions,
    // regardless of content (video, image, shape, sticker, or text).
    // Audio, group, caption, and cutout blocks report false.
    const canTransition =
      engine.block.supportsTransition(clipA) &&
      engine.block.supportsTransition(clipB);
    // eslint-disable-next-line no-console
    console.log('Clips support transitions:', canTransition);

    // Create a transition block and set how long the blend should last
    const crossFade = engine.block.createTransition('cross-fade');
    engine.block.setDuration(crossFade, 1);

    // Assign the transition to the outgoing clip. It blends this clip
    // into the next clip on the same track.
    engine.block.setTransition(clipA, crossFade);

    // Assigning a transition overlaps the two clips: the incoming clip and
    // everything after it move earlier by the transition duration.
    // eslint-disable-next-line no-console
    console.log(
      'Clip B now starts at:',
      engine.block.getTimeOffset(clipB),
      'seconds (was 4)'
    );

    // Per-type properties use the generic block setters with
    // 'transition/{type}/{property}' keys. Discover what a type
    // exposes with findAllProperties.
    const push = engine.block.createTransition('push');
    engine.block.setDuration(push, 1);
    engine.block.setTransition(clipB, push);
    // eslint-disable-next-line no-console
    console.log('Push properties:', engine.block.findAllProperties(push));

    engine.block.setEnum(push, 'transition/push/direction', 'Left');

    // With morph enabled, position, rotation, scale, and shape are
    // interpolated between the outgoing and incoming clip.
    engine.block.setBool(push, 'transition/push/morph', true);

    // Read back the assigned transition. An unset relation returns an
    // invalid block, so check the result with isValid.
    const assigned = engine.block.getTransition(clipA);
    if (engine.block.isValid(assigned)) {
      // eslint-disable-next-line no-console
      console.log('Clip A transitions with:', engine.block.getType(assigned));
    }

    // Replace a transition: detach the old block, destroy it to avoid
    // leaks, then assign the new one. removeTransition alone restores
    // the original clip timing.
    const fadeToBlack = engine.block.createTransition('fade-to-black');
    engine.block.setDuration(fadeToBlack, 1);
    engine.block.setTransition(clipC, fadeToBlack);

    engine.block.removeTransition(clipC);
    engine.block.destroy(fadeToBlack);

    const colorWipe = engine.block.createTransition('color-wipe');
    engine.block.setDuration(colorWipe, 1);
    engine.block.setTransition(clipC, colorWipe);
    engine.block.setEnum(colorWipe, 'transition/color-wipe/direction', 'Up');
    engine.block.setColor(colorWipe, 'transition/color-wipe/color', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });

    // Fit the page duration to the reflowed sequence
    const lastClip = clips[clips.length - 1];
    engine.block.setDuration(
      page,
      engine.block.getTimeOffset(lastClip) + engine.block.getDuration(lastClip)
    );

    // Park the playhead inside the first overlap window so the
    // cross-fade blend is visible on load
    engine.block.setPlaybackTime(page, 3.5);
    engine.block.select(clipA);

    // eslint-disable-next-line no-console
    console.log(
      'Apply Transitions guide initialized. Press play to watch the clips blend.'
    );
  }
}

export default Example;
