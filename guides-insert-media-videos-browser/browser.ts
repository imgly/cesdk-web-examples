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
 * CE.SDK Plugin: Insert Videos Guide
 *
 * Demonstrates inserting videos into a CE.SDK scene:
 * - Using the addVideo() convenience API (Video mode only)
 * - Using graphic blocks with video fills (works in any mode)
 * - Configuring trim offset and trim length
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

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


    cesdk.feature.enable('ly.img.video');
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;

    // Videos from the ly.img.video demo asset source
    const surferVideoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';
    const laptopVideoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-tony-schnagl-5528015.mp4';

    const page = engine.scene.getCurrentPage();
    if (page == null) return;

    // Get page dimensions for responsive layout
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Layout: videos span width with margins, each takes half height
    const margin = 40;
    const gap = 20;
    const videoWidth = pageWidth - margin * 2;
    const videoHeight = (pageHeight - margin * 2 - gap) / 2;

    const videoBlock = await engine.block.addVideo(
      surferVideoUrl,
      videoWidth,
      videoHeight
    );
    engine.block.setPositionX(videoBlock, margin);
    engine.block.setPositionY(videoBlock, margin);

    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', laptopVideoUrl);
    engine.block.setFill(block, fill);

    engine.block.setWidth(block, videoWidth);
    engine.block.setHeight(block, videoHeight);
    engine.block.setPositionX(block, margin);
    engine.block.setPositionY(block, margin + videoHeight + gap);
    engine.block.appendChild(page, block);

    // Force load the first video's resource for thumbnails
    const videoBlockFill = engine.block.getFill(videoBlock);
    await engine.block.forceLoadAVResource(videoBlockFill);

    await engine.block.forceLoadAVResource(fill);
    engine.block.setTrimOffset(fill, 2.0);
    engine.block.setTrimLength(fill, 5.0);

    const duration = engine.block.getAVResourceTotalDuration(fill);
    console.log(`Video duration: ${duration}s, playing 2-7s`);

    // Set playback time to 1 second for hero image capture
    engine.block.setPlaybackTime(page, 1.0);

    // Wait a moment for thumbnails to generate
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Enable zoom auto-fit to keep the page in view
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);

    // Select the page for a cleaner hero image
    engine.block.select(page);
  }
}

export default Example;
