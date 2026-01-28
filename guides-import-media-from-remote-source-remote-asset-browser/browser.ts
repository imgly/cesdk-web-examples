import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-import-media-from-remote-source-remote-asset-browser';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default and demo asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Create a video scene
    await cesdk.createVideoScene();

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

    const customSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(customAssetJSON);
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
