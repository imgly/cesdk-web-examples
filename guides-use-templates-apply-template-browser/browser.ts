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
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Apply a Template
 *
 * This example demonstrates how to apply template content to an existing scene:
 * 1. Creating a scene with specific dimensions
 * 2. Applying a template from a URL while preserving dimensions
 * 3. Switching between templates
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
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    await cesdk.actions.run('scene.create', { page: { width: 1080, height: 1920, unit: 'Pixel' } });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set custom page dimensions - these will be preserved when applying templates

    // Apply a template from URL - content adjusts to fit current page dimensions
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    await engine.scene.applyTemplateFromURL(templateUrl);

    // Auto-fit zoom to page
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    console.log('Template applied from URL');

    // Verify that page dimensions are preserved after applying template
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Page dimensions preserved: ${width}x${height}`);

    // Demonstrate template switching - apply a different template
    // The page dimensions remain the same while content changes
    const alternativeTemplateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene';

    // Uncomment to switch templates:
    // await engine.scene.applyTemplateFromURL(alternativeTemplateUrl);
    // console.log('Switched to alternative template');

    // Store for potential use
    console.log('Alternative template URL:', alternativeTemplateUrl);

    console.log('Apply template example completed');
  }
}

export default Example;
