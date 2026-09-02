import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
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

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load the video editor config (provides the timeline, playback, and full UI)
    await cesdk.addPlugin(new VideoEditorConfig());

    // The timeline and its parts are gated by the Feature API. Enable the whole
    // family with a glob, or enable individual features for finer control.
    cesdk.feature.enable('ly.img.video.timeline.*');

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

    // Build a video track with three clips and a background music track so the
    // timeline renders multiple rows worth of content to customize.
    const videoUrls = [
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-tony-schnagl-5528015.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4'
    ];

    const videoTrack = engine.block.create('track');
    engine.block.appendChild(page, videoTrack);

    const clips: number[] = [];
    for (const url of videoUrls) {
      const clip = await engine.block.addVideo(url, 1280, 720, {
        timeline: { duration: 4 }
      });
      engine.block.appendChild(videoTrack, clip);
      clips.push(clip);
    }
    engine.block.fillParent(videoTrack);

    // A cross-fade between the first two clips gives the transition control
    // something to render in the timeline.
    const crossFade = engine.block.createTransition('cross-fade');
    engine.block.setDuration(crossFade, 1);
    engine.block.setTransition(clips[0], crossFade);

    // A second track holding an audio clip demonstrates the multi-track view.
    const audioBlock = engine.block.create('audio');
    engine.block.appendChild(page, audioBlock);
    engine.block.setString(
      audioBlock,
      'audio/fileURI',
      'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a'
    );
    engine.block.setDuration(audioBlock, 12);

    // Show every track in the timeline. 'active' collapses the timeline to a
    // single row showing only the selected track's clips.
    cesdk.engine.editor.setSetting('timeline/trackVisibility', 'all');

    // Keep the transition control between adjacent clips permanently visible
    // instead of revealing it only on hover.
    cesdk.engine.editor.setSetting(
      'timeline/transitionControlVisibility',
      'always'
    );

    // Give the timeline a fixed 320px height. Pass { height: 'auto' } to
    // restore the content-hugging default, or add maxHeight to cap how tall
    // the auto-growing timeline may get.
    cesdk.actions.run('timeline.setHeight', { height: 320 });

    // Register a custom Rewind button that jumps playback back to the start.
    cesdk.ui.registerComponent(
      'ly.img.video.timeline.rewind',
      ({ builder }) => {
        builder.Button('rewind', {
          label: 'Rewind',
          icon: '@imgly/Repeat',
          onClick: () => {
            engine.block.setPlaybackTime(page, 0);
          }
        });
      }
    );

    // The video editor config already sets a default controls bar order. Add
    // the Rewind button to the front and remove the loop control.
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.video.timeline.controls.bar', position: 'start' },
      'ly.img.video.timeline.rewind'
    );

    cesdk.ui.removeOrderComponent({
      in: 'ly.img.video.timeline.controls.bar',
      match: 'ly.img.video.timeline.loop'
    });

    // The "Add Clip" button below the tracks runs the built-in `addClip`
    // action. Toggle the button with its feature, or register your own action
    // to change what the button does.
    cesdk.feature.enable('ly.img.video.timeline.addClip');

    cesdk.actions.register('addClip', () => {
      cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
        payload: {
          entries: ['ly.img.image', 'ly.img.video'],
          applyAssetContext: { clipType: 'clip' }
        }
      });
    });

    // Select the first clip so the timeline is populated for the hero image.
    engine.block.select(clips[0]);
  }
}

export default Example;
