import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Assets Concepts Guide
 *
 * Demonstrates the core concepts of the asset system:
 * - What assets are and how they differ from blocks
 * - Creating and registering asset sources
 * - Querying and applying assets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.createDesignScene();
    const engine = cesdk.engine;

    // An asset is a content definition with metadata
    // It describes content that can be added to designs
    const stickerAsset: AssetResult = {
      id: 'sticker-smile',
      label: 'Smile Sticker',
      tags: ['emoji', 'happy'],
      groups: ['stickers'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        width: 62,
        height: 58,
        mimeType: 'image/svg+xml'
      }
    };

    // Asset sources provide assets to the editor
    // Each source has an id and a findAssets() method
    const customSource: AssetSource = {
      id: 'my-assets',

      async findAssets(query: AssetQueryData): Promise<AssetsQueryResult> {
        // Return paginated results matching the query
        return {
          assets: [stickerAsset],
          total: 1,
          currentPage: query.page,
          nextPage: undefined
        };
      }
    };

    engine.asset.addSource(customSource);

    // Query assets from a source
    const results = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 10
    });
    console.log('Found assets:', results.total);

    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      const page = engine.scene.getCurrentPage();
      if (page && blockId) {
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        // SVG is 62x58, scale to fit nicely
        const stickerWidth = 62;
        const stickerHeight = 58;
        engine.block.setWidth(blockId, stickerWidth);
        engine.block.setHeight(blockId, stickerHeight);
        engine.block.setPositionX(blockId, (pageWidth - stickerWidth) / 2);
        engine.block.setPositionY(blockId, (pageHeight - stickerHeight) / 2);
      }
    }

    // Local sources support dynamic add/remove operations
    engine.asset.addLocalSource('uploads', ['image/svg+xml', 'image/png']);

    engine.asset.addAssetToSource('uploads', {
      id: 'uploaded-1',
      label: { en: 'Heart Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });

    // Subscribe to asset source lifecycle events
    const unsubscribe = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log('Source updated:', sourceId);
    });

    // Notify that source contents changed
    engine.asset.assetSourceContentsChanged('uploads');

    unsubscribe();
  }
}

export default Example;
