import CreativeEngine, { EnginePlugin, EnginePluginContext } from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Plugin Architecture Guide
 *
 * Demonstrates that engine plugins run headless:
 * - Defining an EnginePlugin
 * - Applying it to the headless engine
 * - Using the capability it added without any editor UI
 */

// The same engine plugin shape as in the browser: only the engine
// is available in its context, so it runs anywhere the engine runs.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}

async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // @cesdk/node has no addPlugin() method — apply the plugin by
    // invoking its initialize with the engine context
    new BrandAssetsPlugin().initialize({ engine });

    // The asset source registered by the plugin is available immediately
    const result = await engine.asset.findAssets('brand-assets', {
      page: 0,
      perPage: 10
    });
    console.log(`brand-assets provides ${result.total} asset(s)`);

  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Example failed:', error);
  process.exit(1);
});
