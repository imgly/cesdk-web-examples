import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Font Size Unit Guide
 *
 * Demonstrates working with the scene's font-size unit:
 * - Reading the scene's current `fontSizeUnit`
 * - Switching the unit between `'Pixel'` and `'Point'` at runtime
 * - Setting and reading font sizes that follow the scene unit
 * - Overriding the unit on a per-call basis with `TextFontSizeOptions`
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins so the editor has its standard panels.
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new DemoAssetSources());
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());

    // Create a default Pixel-based design scene.
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Read the scene's current font-size unit.
    // For a Pixel-based scene this defaults to 'Pixel'.
    const initialUnit = engine.scene.getFontSizeUnit();
    console.log('Initial font-size unit:', initialUnit); // 'Pixel'

    // Switch the scene-wide default to Point. Existing text keeps its visual
    // size; only the unit used by `setTextFontSize` / `getTextFontSizes`
    // (when no `unit` option is passed) changes.
    engine.scene.setFontSizeUnit('Point');
    console.log('After switch:', engine.scene.getFontSizeUnit()); // 'Point'

    // Add a text block to demonstrate how the unit flows through the text APIs.
    const page = engine.block.findByType('page')[0];
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.setString(text, 'text/text', 'Font Size Unit');
    engine.block.setPositionX(text, 80);
    engine.block.setPositionY(text, 480);
    engine.block.setWidth(text, 920);
    engine.block.setHeight(text, 120);

    // No `unit` option: the value is interpreted in the scene's `fontSizeUnit`,
    // which we set to 'Point' above. The engine reads this as 18 pt.
    engine.block.setTextFontSize(text, 18);

    // Override the unit for a single call. CE.SDK converts the supplied
    // value into the scene's unit using the scene's DPI, so the same text
    // can be sized in pixels even though the scene default is points.
    engine.block.setTextFontSize(text, 24, { unit: 'Pixel' });

    // Without `unit`, the returned values are in the scene's unit (Point).
    const sizesInSceneUnit = engine.block.getTextFontSizes(text);
    console.log('Sizes (scene unit, pt):', sizesInSceneUnit);

    // Pass `{ unit }` to read the same sizes in a different unit.
    const sizesInPixels = engine.block.getTextFontSizes(text, {
      unit: 'Pixel'
    });
    console.log('Sizes (px):', sizesInPixels);
  }
}

export default Example;
