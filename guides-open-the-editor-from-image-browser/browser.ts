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

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    const engine = cesdk.engine;

    // ========================================
    // Create Scene from Remote Image URL
    // ========================================
    // The most common approach: load an image directly from a URL
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_4.jpg';

    // Create a scene sized to match the image dimensions
    await engine.scene.createFromImage(imageUrl);

    // The scene is now ready for editing with the image as content

    // ========================================
    // Working with the Created Scene
    // ========================================
    // After creating the scene, access the page for modifications
    const pages = engine.block.findByType('page');
    const page = pages[0];

    if (page) {
      // Get the page dimensions (set from the image)
      const width = engine.block.getWidth(page);
      const height = engine.block.getHeight(page);
      console.log(`Scene created with dimensions: ${width}x${height}`);
    }

    // Zoom to show the full scene
    if (page) {
      await engine.scene.zoomToBlock(page);
    }
  }
}

export default Example;
