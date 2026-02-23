import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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

class Example implements EditorPlugin {
  name = 'guides-import-media-from-remote-source-remote-asset-browser';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;

    // Load remote assets from a JSON manifest URL
    // The parent directory of the JSON file is used as the base path for relative URLs
    const audioSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/content.json'
    );
    console.log('Loaded audio assets from:', audioSourceId);

    // Load image assets from another remote JSON manifest
    const imageSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/content.json'
    );
    console.log('Loaded image assets from:', imageSourceId);

    // Load assets from a JSON string when content is already available
    const customAssetJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my.custom.assets',
      assets: [
        {
          id: 'sample_image_1',
          label: { en: 'Sample Image 1' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        },
        {
          id: 'sample_image_2',
          label: { en: 'Sample Image 2' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const customSourceId = await engine.asset.addLocalAssetSourceFromJSONString(
      customAssetJSON
    );
    console.log('Created custom asset source:', customSourceId);

    // When loading from string, you can specify a custom base path
    // for resolving {{base_url}} placeholders in the manifest
    const assetsWithBasePath = JSON.stringify({
      version: '2.0.0',
      id: 'my.cdn.assets',
      assets: [
        {
          id: 'cdn_image',
          label: { en: 'CDN Image' },
          meta: {
            uri: '{{base_url}}/sample_1.jpg',
            thumbUri: '{{base_url}}/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const cdnSourceId = await engine.asset.addLocalAssetSourceFromJSONString(
      assetsWithBasePath,
      'https://img.ly/static/ubq_samples/'
    );
    console.log('Created CDN asset source with custom base path:', cdnSourceId);

    // Verify loaded assets by querying the asset source
    const audioAssets = await engine.asset.findAssets(audioSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${audioAssets.total} audio assets`);

    const customAssets = await engine.asset.findAssets(customSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${customAssets.total} custom assets`);

    // Apply an asset from the loaded source to the scene
    const imageAssets = await engine.asset.findAssets(imageSourceId, {
      page: 0,
      perPage: 10
    });
    if (imageAssets.assets.length > 0) {
      const asset = imageAssets.assets[0];
      await engine.asset.apply(imageSourceId, asset);
      console.log('Applied asset:', asset.id);
    }

    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    console.log('All registered asset sources:', allSources);

    // Remove an asset source when no longer needed
    engine.asset.removeSource(cdnSourceId);
    console.log('Removed asset source:', cdnSourceId);
  }
}

export default Example;
