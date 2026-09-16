import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Text on a Path Guide
 *
 * Demonstrates curving a text block along an SVG path:
 * - Placing text on a path with setTextOnPath()
 * - Positioning the text vertically relative to the path
 * - Offsetting the text along the path
 * - Flipping the text to the other side of the path
 * - Reading and clearing the path
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a text block and give it some content
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.replaceText(text, 'TEXT ON A PATH');
    engine.block.setTextFontSize(text, 48);

    // Curve the text onto a circle. The SVG path must contain a single subpath;
    // the block resizes to match the path's aspect ratio and word wrapping is disabled.
    const circlePath = 'M 60,119.5 A 59.5,59.5 0 1,1 60.01,119.5 Z';
    engine.block.setTextOnPath(text, circlePath);

    // Position the text relative to the path: 'Top', 'Center', or 'Bottom'
    engine.block.setEnum(text, 'text/verticalAlignment', 'Center');

    // Slide the text along the path. The offset is proportional, from -1 to 1.
    engine.block.setTextOnPathOffset(text, 0.05);

    // Keep the text on the outside of the curve. Pass `true` to flip it to the
    // other side of the path and reverse its direction.
    engine.block.setTextOnPathFlipped(text, false);

    // Read the block's current path (returns the SVG string, or null)
    const currentPath = engine.block.getTextOnPath(text);
    console.log('Text on path:', currentPath);

    // To remove the curve and restore a straight baseline, pass null:
    // engine.block.setTextOnPath(text, null);

    // Center the curved block on the page
    const width = engine.block.getWidth(text);
    const height = engine.block.getHeight(text);
    engine.block.setPositionX(text, (800 - width) / 2);
    engine.block.setPositionY(text, (600 - height) / 2);

    // Select the block so it's active when the Path panel opens
    engine.block.select(text);
  }
}

export default Example;
