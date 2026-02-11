import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Using Default Assets Guide
 *
 * Demonstrates loading all asset sources from IMG.LY's CDN using
 * addLocalAssetSourceFromJSONURI and creating a scene with
 * a star shape, sticker, and image.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk, engine }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Versioned CDN URLs using the SDK package (recommended)
    // For production, self-host these assets - see the Serve Assets guide
    const PACKAGE_BASE = `https://cdn.img.ly/packages/imgly/cesdk-js/${cesdk.version}/assets`;
    const DEFAULT_ASSETS_URL = `${PACKAGE_BASE}/v4/`;
    const DEMO_ASSETS_URL = `${PACKAGE_BASE}/demo/v3/`;

    // Load default asset sources (core editor components)
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.sticker/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.vectorpath/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.colors.defaultPalette/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.filter.lut/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.filter.duotone/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.effect/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.blur/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.typeface/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.crop.presets/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.page.presets/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.page.presets.video/content.json`
    );

    // Load demo asset sources (sample content for testing)
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.image/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.video/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.audio/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.template/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.video.template/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.textComponents/content.json`
    );

    // Update asset library entries to show the loaded sources in the UI
    cesdk.ui.updateAssetLibraryEntry('ly.img.sticker', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.sticker'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.vectorpath', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.vectorpath'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.colors.defaultPalette', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.colors.defaultPalette'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.filter.lut', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.filter.lut'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.filter.duotone', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.filter.duotone'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.effect', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.effect'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.blur', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.blur'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.typeface', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.typeface'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.crop.presets', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.crop.presets'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.page.presets', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.page.presets'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.page.presets.video', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.page.presets.video'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.image'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.video', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.video'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.audio'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.template', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.template'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.video.template', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.video.template'])
      ]
    });
    cesdk.ui.updateAssetLibraryEntry('ly.img.textComponents', {
      sourceIds: ({ currentIds }) => [
        ...new Set([...currentIds, 'ly.img.textComponents'])
      ]
    });

    // Create the design scene
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Get the page to add content to
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (page == null) return;

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Define the three assets to add: star shape, sticker, and image
    const assetsToAdd = [
      {
        sourceId: 'ly.img.vectorpath',
        assetId: '//ly.img.ubq/shapes/star/filled'
      },
      {
        sourceId: 'ly.img.sticker',
        assetId: '//ly.img.cesdk.stickers.emoticons/alien'
      },
      {
        sourceId: 'ly.img.image',
        assetId: 'ly.img.cesdk.images.samples/sample.1'
      }
    ];

    // Calculate layout for 3 centered blocks
    const blockSize = Math.min(pageWidth, pageHeight) * 0.2;
    const spacing = blockSize * 0.3;
    const totalWidth =
      assetsToAdd.length * blockSize + (assetsToAdd.length - 1) * spacing;
    const startX = (pageWidth - totalWidth) / 2;
    const centerY = (pageHeight - blockSize) / 2;

    // Create and position each block
    for (let i = 0; i < assetsToAdd.length; i++) {
      const { sourceId, assetId } = assetsToAdd[i];
      const asset = await engine.asset.fetchAsset(sourceId, assetId);

      if (asset != null) {
        const block = await engine.asset.apply(sourceId, asset);

        if (block != null) {
          engine.block.setWidth(block, blockSize);
          engine.block.setHeight(block, blockSize);
          engine.block.setPositionX(block, startX + i * (blockSize + spacing));
          engine.block.setPositionY(block, centerY);
        }
      }
    }

    // Clear selection for cleaner visual
    for (const block of engine.block.findAllSelected()) {
      engine.block.setSelected(block, false);
    }

    // Open the Elements panel to showcase all loaded asset sources
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.image', 'ly.img.vectorpath', 'ly.img.sticker']
      }
    });
  }
}

export default Example;
