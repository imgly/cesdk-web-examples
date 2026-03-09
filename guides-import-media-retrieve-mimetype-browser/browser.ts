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

    // Load an archive that contains embedded resources (images and fonts)
    const archiveUrl =
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
    await engine.scene.loadFromArchiveURL(archiveUrl);

    // Find all transient resources (embedded media with buffer:// URIs)
    // This includes both images and fonts embedded in the archive
    const transientResources = engine.editor.findAllTransientResources();
    console.log(`Found ${transientResources.length} transient resources`);

    if (transientResources.length === 0) {
      console.log('No transient resources found in the loaded archive');
      return;
    }

    // Get MIME types for all resources to see what's included
    const resourcesByType: Record<string, number> = {};
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
    }
    console.log('Resources by type:', resourcesByType);

    // Filter to find only image resources
    const imageResources = [];
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      if (mimeType.startsWith('image/')) {
        imageResources.push({ ...resource, mimeType });
      }
    }
    console.log(`Found ${imageResources.length} image resources`);

    // Relocate all transient resources from buffer:// URIs to blob: URLs
    // This is useful for displaying previews or preparing for upload
    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const length = engine.editor.getBufferLength(bufferUri);
      const data = engine.editor.getBufferData(bufferUri, 0, length);

      // Create a blob URL from the buffer data
      const blob = new Blob([new Uint8Array(data)], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Update the scene to use the new URL instead of buffer://
      engine.editor.relocateResource(bufferUri, blobUrl);
    }
    console.log('Relocated all transient resources to blob URLs');

    // After relocation, the scene references blob: URLs instead of buffer:// URIs
    // Note: blob: URLs are still considered transient (runtime) resources
    // For permanent storage, upload to a CDN and relocate to https:// URLs
    console.log(`Relocated ${transientResources.length} buffer:// URIs to blob: URLs`);

    // Zoom to fit the scene
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await cesdk.engine.scene.zoomToBlock(pages[0], { padding: 40 });
    }

    console.log('Retrieve MIME Type example loaded successfully');
  }
}

export default Example;
