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
 * CE.SDK Plugin: Motion Blur Guide
 *
 * Demonstrates how to blur moving blocks in the preview and in video export:
 * - Turning motion blur on for a block
 * - Tuning the shutter angle, the shutter phase and the samples of the scene
 * - The scene frame rate that sets the length of one frame
 * - The preview motion blur setting
 * - Exporting a video with motion blur
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
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get()!;
    const page = engine.block.findByType('page')[0]!;
    engine.block.setDuration(page, 2);

    // A square that crosses the page in one second. Motion blur needs motion.
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    const fill = engine.block.createFill('color');
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.4,
      a: 1
    });
    engine.block.setFill(block, fill);
    engine.block.setWidth(block, 300);
    engine.block.setHeight(block, 300);
    engine.block.setPositionY(block, 390);
    engine.block.appendChild(page, block);
    engine.block.setDuration(block, 2);

    engine.block.setKeyframes(block, 'position/x', [
      { time: 0, value: { type: 'Float', value: 100 } },
      { time: 0.5, value: { type: 'Float', value: 1520 } },
      { time: 1, value: { type: 'Float', value: 100 } }
    ]);

    // Blur the block while it moves
    engine.block.setBool(block, 'motionBlur/enabled', true);
    console.log(engine.block.getBool(block, 'motionBlur/enabled')); // true

    // Graphic, text and caption blocks have the property. Pages do not.
    const blockProperties = engine.block.findAllProperties(block);
    console.log(blockProperties.includes('motionBlur/enabled')); // true
    const pageProperties = engine.block.findAllProperties(page);
    console.log(pageProperties.includes('motionBlur/enabled')); // false

    // The scene holds the shutter for all blocks with motion blur.
    // 360 degrees keeps the shutter open for one full frame.
    engine.block.setFloat(scene, 'motionBlur/shutterAngle', 360);
    // -180 degrees, half the angle, centers the shutter on the frame time
    engine.block.setFloat(scene, 'motionBlur/shutterPhase', -180);

    // More samples give a smoother trail and take longer to render
    engine.block.setInt(scene, 'motionBlur/samples', 32);
    console.log(engine.block.getInt(scene, 'motionBlur/samples')); // 32

    // One frame of the scene frame rate is the span the shutter angle refers to
    engine.block.setFloat(scene, 'scene/frameRate', 30);

    // The preview draws the motion blur by default.
    // Set the value to false to show the blocks sharp while editing.
    engine.editor.setSettingBool('features/previewMotionBlurEnabled', true);

    try {
      engine.block.setInt(scene, 'motionBlur/samples', 100);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.MOTION_BLUR_VALUE_OUT_OF_RANGE'
      }
    }

    // Image export draws no motion blur. Export a video to see it in a file.
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

    // Show the block at full speed, halfway across the page
    engine.block.setPlaybackTime(page, 0.5);
  }
}

export default Example;
