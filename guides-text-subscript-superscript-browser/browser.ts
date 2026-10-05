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
 * CE.SDK Plugin: Subscript and Superscript Guide
 *
 * Demonstrates subscript and superscript text formatting:
 * - Applying superscript and subscript to character ranges
 * - Querying the script styles of a range
 * - Reading the script style of each text run
 * - Resetting text to the normal baseline
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


    // Create a text block to demonstrate subscript and superscript
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 100);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, 'Auto');
    engine.block.setHeightMode(text, 'Auto');
    engine.block.setFloat(text, 'text/fontSize', 64);
    engine.block.replaceText(text, '$1999 H2O E=mc2');

    // Raise the cents of the price above the baseline using UTF-16 indices.
    // Superscript text is scaled down and raised automatically.
    engine.block.setTextScriptStyle(text, 'Superscript', 3, 5);

    // Raise the exponent of the formula
    engine.block.setTextScriptStyle(text, 'Superscript', 14, 15);

    // Lower the "2" of the water formula below the baseline
    engine.block.setTextScriptStyle(text, 'Subscript', 7, 8);

    // Query the unique script styles in a range, in document order
    const scriptStyles = engine.block.getTextScriptStyles(text);
    // e.g. ['Normal', 'Superscript', 'Subscript']

    // Query a specific range
    const centsScriptStyle = engine.block.getTextScriptStyles(text, 3, 5);
    // ['Superscript']

    // Each text run reports its script style
    const runs = engine.block.getTextRuns(text);
    // e.g. runs[1].scriptStyle === 'Superscript'

    // Adjust the size and position of shifted text for the whole block.
    // The scale is a factor of the font size. The shift is a fraction of
    // the unscaled font size.
    engine.block.setFloat(text, 'text/superscriptFontScale', 0.65);
    engine.block.setFloat(text, 'text/superscriptVerticalShift', 0.4);
    engine.block.setFloat(text, 'text/subscriptFontScale', 0.65);
    engine.block.setFloat(text, 'text/subscriptVerticalShift', 0.25);

    // Reset a range back to the normal baseline
    engine.block.setTextScriptStyle(text, 'Superscript', 0, 1);
    engine.block.setTextScriptStyle(text, 'Normal', 0, 1);

    // Select the text block to show it in the inspector
    engine.block.setSelected(text, true);

    // Suppress unused variable warnings
    void scriptStyles;
    void centsScriptStyle;
    void runs;
  }
}

export default Example;
