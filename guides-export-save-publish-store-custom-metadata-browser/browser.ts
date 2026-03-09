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
 * CE.SDK Plugin: Store Custom Metadata Guide
 *
 * Demonstrates how to attach, retrieve, and manage custom metadata on design blocks:
 * - Setting metadata key-value pairs
 * - Getting metadata values by key
 * - Checking if metadata exists
 * - Listing all metadata keys
 * - Removing metadata
 * - Storing structured data as JSON
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create an image block to attach metadata to
    const imageBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: 400, height: 300 } }
    );
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    // Set metadata key-value pairs on the block
    engine.block.setMetadata(imageBlock, 'externalId', 'asset-12345');
    engine.block.setMetadata(imageBlock, 'source', 'user-upload');
    engine.block.setMetadata(imageBlock, 'uploadedBy', 'user@example.com');
    console.log('Set metadata: externalId, source, uploadedBy');

    // Retrieve a metadata value by key
    if (engine.block.hasMetadata(imageBlock, 'externalId')) {
      const externalId = engine.block.getMetadata(imageBlock, 'externalId');
      console.log('External ID:', externalId);
    }

    // List all metadata keys on the block
    const allKeys = engine.block.findAllMetadata(imageBlock);
    console.log('All metadata keys:', allKeys);

    // Log all key-value pairs
    for (const key of allKeys) {
      const value = engine.block.getMetadata(imageBlock, key);
      console.log(`  ${key}: ${value}`);
    }

    // Store structured data as JSON
    const generationInfo = {
      source: 'ai-generated',
      model: 'stable-diffusion',
      timestamp: Date.now()
    };
    engine.block.setMetadata(
      imageBlock,
      'generationInfo',
      JSON.stringify(generationInfo)
    );

    // Retrieve and parse structured data
    const retrievedJson = engine.block.getMetadata(
      imageBlock,
      'generationInfo'
    );
    const parsedInfo = JSON.parse(retrievedJson);
    console.log('Parsed generation info:', parsedInfo);

    // Remove a metadata key
    engine.block.removeMetadata(imageBlock, 'uploadedBy');
    console.log('Removed metadata key: uploadedBy');

    // Verify the key was removed
    const hasUploadedBy = engine.block.hasMetadata(imageBlock, 'uploadedBy');
    console.log('Has uploadedBy after removal:', hasUploadedBy);

    // List remaining keys
    const remainingKeys = engine.block.findAllMetadata(imageBlock);
    console.log('Remaining metadata keys:', remainingKeys);

    // Select the image block to show it in focus
    engine.block.select(imageBlock);

    console.log(
      'Metadata guide initialized. Check the console for metadata operations.'
    );
  }
}

export default Example;
