import type {
  EditorPlugin,
  EditorPluginContext,
  Typeface
} from '@cesdk/cesdk-js';

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
import { createVariableFontCombinations } from '@cesdk/engine';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Variable Fonts Guide
 *
 * Demonstrates using a variable font in CE.SDK:
 * - Generating all font variants from a single file with
 *   createVariableFontCombinations()
 * - Registering the variable font as a custom typeface asset source
 * - Showing it in the editor's typeface library
 * - Applying the font at different weights, all rendered from one file
 * - Switching weights on existing text
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

    // Jost is a variable font: one file covers all weights from 100 to 900.
    const fontFileURI =
      'https://cdn.jsdelivr.net/fontsource/fonts/jost:vf@5/latin-wght-normal.woff2';

    // Generate a font entry for every variant the file supports. All entries
    // share the same URI but declare different weights.
    const fonts = createVariableFontCombinations(
      fontFileURI,
      true, // weight variants: Thin (100) through Heavy (900)
      false // italic variants: this file has no `ital` axis
    );

    const typeface: Typeface = {
      name: 'Jost',
      fonts
    };

    const sourceId = 'my-variable-fonts';
    engine.asset.addLocalSource(sourceId);

    await engine.asset.addAssetToSource(sourceId, {
      id: 'jost',
      meta: { languages: 'latin' },
      payload: { typeface }
    });

    // Give the custom source a readable name in the typeface library's source filter
    cesdk.i18n.setTranslations({
      en: { 'libraries.my-variable-fonts.label': 'Variable Fonts' }
    });

    cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
      sourceIds: ['ly.img.typeface', 'my-variable-fonts']
    });

    // Every block renders from the same font file at a different weight.
    const weightSamples = [
      { weight: 'thin', label: 'Thin 100' },
      { weight: 'normal', label: 'Regular 400' },
      { weight: 'bold', label: 'Bold 700' },
      { weight: 'heavy', label: 'Heavy 900' }
    ] as const;

    weightSamples.forEach(({ weight, label }, index) => {
      const text = engine.block.create('text');
      engine.block.appendChild(page, text);
      engine.block.replaceText(text, label);
      engine.block.setTextFontSize(text, 56);
      engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
      engine.block.setWidth(text, 700);
      engine.block.setHeightMode(text, 'Auto');
      engine.block.setPositionX(text, 50);
      engine.block.setPositionY(text, 160 + index * 105);

      engine.block.setTypeface(text, typeface);
      engine.block.setTextFontWeight(text, weight);
    });

    // A headline to demonstrate switching weights on existing text
    const headline = engine.block.create('text');
    engine.block.appendChild(page, headline);
    engine.block.replaceText(headline, 'Variable Fonts');
    engine.block.setTextFontSize(headline, 64);
    engine.block.setEnum(headline, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(headline, 700);
    engine.block.setHeightMode(headline, 'Auto');
    engine.block.setPositionX(headline, 50);
    engine.block.setPositionY(headline, 48);
    engine.block.setTypeface(headline, typeface);

    // Switch to another weight at any time. The engine resolves the matching
    // variant from the typeface and renders it from the same font file.
    engine.block.setTextFontWeight(headline, 'extraBold');

    // If the font file also provides an `ital` axis, styles switch the same way:
    // engine.block.setTextFontStyle(headline, 'italic');

    // Query the weights used in a text block or range
    const currentWeights = engine.block.getTextFontWeights(headline);
    console.log('Headline font weights:', currentWeights); // ['extraBold']

    // Select the headline so the inspector shows the font style dropdown
    engine.block.select(headline);
  }
}

export default Example;
