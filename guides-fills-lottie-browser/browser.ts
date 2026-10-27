import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

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

/**
 * CE.SDK Plugin: Lottie Fills Guide
 *
 * Demonstrates how to play a Lottie animation as the fill of a block:
 * - Writing a Lottie document that references an image by URL
 * - Setting the document as the file of a video fill
 * - Waiting until the Lottie and its image are loaded
 * - Handling a file that is not a Lottie
 * - Exporting a video of the animation
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
      layout: 'DepthStack',
      page: { width: 1000, height: 1000, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;
    engine.block.setDuration(page, 3);

    // A 3 second Lottie at 30 frames per second. Its image layer fades in a
    // photo and zooms into it. The asset names the photo by an absolute URL.
    const lottie = {
      v: '5.7.0',
      fr: 30,
      ip: 0,
      op: 90,
      w: 1000,
      h: 1000,
      assets: [
        {
          id: 'photo',
          w: 2500,
          h: 1667,
          u: '',
          p: 'https://img.ly/static/ubq_samples/sample_1.jpg',
          e: 0
        }
      ],
      layers: [
        {
          ty: 2,
          refId: 'photo',
          ip: 0,
          op: 90,
          st: 0,
          ks: {
            a: { a: 0, k: [1250, 833] },
            p: { a: 0, k: [500, 500] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [60, 60] },
                { t: 90, s: [80, 80] }
              ]
            },
            o: {
              a: 1,
              k: [
                { t: 0, s: [0] },
                { t: 30, s: [100] }
              ]
            }
          }
        }
      ]
    };

    // A buffer holds the document in memory and gives it a URI
    const lottieURI = engine.editor.createBuffer();
    const bytes = new TextEncoder().encode(JSON.stringify(lottie));
    engine.editor.setBufferData(lottieURI, 0, bytes);

    // A video fill plays the Lottie. Set a hosted .json or .lottie URL the same way.
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 1000);
    engine.block.setHeight(block, 1000);
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', lottieURI);
    engine.block.setFill(block, fill);
    engine.block.appendChild(page, block);
    engine.block.setDuration(block, 3);

    // The load finishes when the Lottie and the images it references are loaded
    await engine.block.forceLoadAVResource(fill);
    console.log(engine.block.getAVResourceTotalDuration(fill)); // 3

    // A file that is not a Lottie or a video does not load
    const brokenURI = engine.editor.createBuffer();
    engine.editor.setBufferData(
      brokenURI,
      0,
      new TextEncoder().encode('not a Lottie')
    );
    const brokenFill = engine.block.createFill('video');
    engine.block.setString(brokenFill, 'fill/video/fileURI', brokenURI);
    try {
      await engine.block.forceLoadAVResource(brokenFill);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'EDITOR.RESOURCE_LOAD_FAILED'
      }
    }
    engine.block.destroy(brokenFill);
    engine.editor.destroyBuffer(brokenURI);

    // A video export draws every frame of the Lottie
    const exportVideo = async () => {
      const video = await engine.block.exportVideo(page, {
        mimeType: 'video/mp4'
      });
      await cesdk.utils.downloadFile(video, 'video/mp4');
    };

    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
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

    // Show the photo after its fade-in
    engine.block.setPlaybackTime(page, 1.5);
  }
}

export default Example;
