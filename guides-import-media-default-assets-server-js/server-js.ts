import CreativeEngine from '@cesdk/node';
import { writeFile } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Using Default Assets
 *
 * Demonstrates loading all asset sources from IMG.LY's CDN using
 * addLocalAssetSourceFromJSONURI and creating a scene with
 * a star shape, sticker, and image.
 */
async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Versioned CDN URLs using the SDK package (recommended)
    // For production, self-host these assets - see the Serve Assets guide
    const PACKAGE_BASE = `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`;
    const DEFAULT_ASSETS_URL = `${PACKAGE_BASE}/v4/`;
    const DEMO_ASSETS_URL = `${PACKAGE_BASE}/demo/v2/`;

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

    // List registered asset sources
    const sources = engine.asset.findAllSources();
    // eslint-disable-next-line no-console
    console.log('Registered asset sources:', sources);

    // Create a scene with a page
    const PAGE_WIDTH = 800;
    const PAGE_HEIGHT = 600;

    engine.scene.create('VerticalStack', {
      page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT } }
    });

    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (page == null) {
      throw new Error('No page found in scene');
    }

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
    const blockSize = Math.min(PAGE_WIDTH, PAGE_HEIGHT) * 0.2;
    const spacing = blockSize * 0.3;
    const totalWidth =
      assetsToAdd.length * blockSize + (assetsToAdd.length - 1) * spacing;
    const startX = (PAGE_WIDTH - totalWidth) / 2;
    const centerY = (PAGE_HEIGHT - blockSize) / 2;

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

    // Export the scene as PNG
    const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
    const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
    await writeFile('output/scene.png', pngBuffer);

    // eslint-disable-next-line no-console
    console.log('Exported scene to output/scene.png');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
