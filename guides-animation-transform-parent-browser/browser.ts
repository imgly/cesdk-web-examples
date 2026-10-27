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
import type CreativeEngine from '@cesdk/engine';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Follow Another Block Guide
 *
 * Demonstrates how a block follows the transform of another block:
 * - A hidden, animated block that drives the blocks that follow it
 * - Linking a block and reading the link back
 * - A chain of links
 * - What a follower inherits and what it keeps
 * - Reading the animated position, removing a link and handling errors
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
    const page = engine.block.findByType('page')[0]!;
    engine.block.setDuration(page, 5);

    const pivot = createCircle(engine, page, 20, { r: 0, g: 0, b: 0, a: 1 });
    engine.block.setPositionX(pivot, 950);
    engine.block.setPositionY(pivot, 530);
    engine.block.setFloat(pivot, 'transform/anchor/x', 10);
    engine.block.setFloat(pivot, 'transform/anchor/y', 10);
    engine.block.setKeyframes(pivot, 'rotation', [
      { time: 0, value: { type: 'Float', value: 0 } },
      { time: 1, value: { type: 'Float', value: 2 * Math.PI } }
    ]);
    engine.block.setVisible(pivot, false);

    const planet = createCircle(engine, page, 120, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setTransformParent(planet, pivot);
    console.log(engine.block.getTransformParent(planet) === pivot); // true
    // The position is now an offset from the pivot's top-left corner,
    // in the pivot's turning space
    engine.block.setPositionX(planet, 300);
    engine.block.setPositionY(planet, -50);

    // The planet spins twice about its center while it circles the pivot
    engine.block.setFloat(planet, 'transform/anchor/x', 60);
    engine.block.setFloat(planet, 'transform/anchor/y', 60);
    engine.block.setKeyframes(planet, 'rotation', [
      { time: 0, value: { type: 'Float', value: 0 } },
      { time: 1, value: { type: 'Float', value: 4 * Math.PI } }
    ]);

    // The moon follows the planet, which follows the pivot
    const moon = createCircle(engine, page, 40, {
      r: 0.85,
      g: 0.85,
      b: 0.8,
      a: 1
    });
    engine.block.setTransformParent(moon, planet);
    engine.block.setPositionX(moon, 160);
    engine.block.setPositionY(moon, 40);

    // A text label follows the planet, too
    const label = engine.block.create('text');
    engine.block.replaceText(label, 'Planet');
    engine.block.setTextFontSize(label, 36);
    engine.block.setWidthMode(label, 'Auto');
    engine.block.setHeightMode(label, 'Auto');
    engine.block.appendChild(page, label);
    engine.block.setTransformParent(label, planet);
    engine.block.setPositionX(label, 0);
    engine.block.setPositionY(label, 140);

    engine.block.setOpacity(planet, 0.5);
    console.log(engine.block.getOpacity(moon)); // 1
    console.log(engine.block.getParent(moon) === page); // true

    // A quarter of the way through, the pivot has turned by 90 degrees
    engine.block.setPlaybackTime(page, 1.25);
    console.log(
      engine.block.getGlobalBoundingBoxX(planet),
      engine.block.getGlobalBoundingBoxY(planet)
    ); // 900 830

    // The label's position is read in page space again, so place it there
    engine.block.setTransformParent(label, null);
    console.log(engine.block.getTransformParent(label)); // null
    engine.block.setPositionX(label, 80);
    engine.block.setPositionY(label, 80);

    try {
      // The pivot cannot follow a block that follows it
      engine.block.setTransformParent(pivot, moon);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.TRANSFORM_PARENT_CYCLE'
      }
    }
    try {
      // Only graphic and text blocks take part in a link
      engine.block.setTransformParent(planet, page);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.TRANSFORM_PARENT_UNSUPPORTED'
      }
    }
  }
}

export default Example;

/** Creates a circle graphic of the given size and color on the page. */
function createCircle(
  engine: CreativeEngine,
  page: number,
  size: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('ellipse'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', color);
  engine.block.setFill(block, fill);
  engine.block.setWidth(block, size);
  engine.block.setHeight(block, size);
  engine.block.appendChild(page, block);
  engine.block.setDuration(block, 5);
  return block;
}
