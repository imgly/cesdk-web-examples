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
 * CE.SDK Plugin: Templating Concepts
 *
 * Demonstrates the core template concepts in CE.SDK:
 * - Loading a template from URL
 * - Discovering and setting variables
 * - Discovering placeholders
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load a postcard template from URL
    // Templates are scenes containing variable tokens and placeholder blocks
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(templateUrl);

    // Zoom to show the full page in the viewport
    const page = engine.scene.getCurrentPage();
    if (page) {
      await engine.scene.zoomToBlock(page, { padding: 40 });
    }

    // Discover what variables this template expects
    // Variables are named slots that can be populated with data
    const variableNames = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log('Template variables:', variableNames);

    // Set variable values to personalize the template
    // These values replace {{variableName}} tokens in text blocks
    engine.variable.setString('Name', 'Jane');
    engine.variable.setString('Greeting', 'Wish you were here!');
    // eslint-disable-next-line no-console
    console.log('Variables set successfully.');

    // Discover placeholder blocks in the template
    // Placeholders mark content slots for user or automation replacement
    const placeholders = engine.block.findAllPlaceholders();
    // eslint-disable-next-line no-console
    console.log('Template placeholders:', placeholders.length);

    // eslint-disable-next-line no-console
    console.log('Templating guide completed successfully.');
  }
}

export default Example;
