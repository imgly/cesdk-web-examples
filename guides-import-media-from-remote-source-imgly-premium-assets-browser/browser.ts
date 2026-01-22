import type {
  EditorPlugin,
  EditorPluginContext,
  AssetDefinition
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Type definition for IMG.LY Premium Assets content.json manifest
 */
interface ContentJSON {
  version: string;
  id: string;
  assets: AssetDefinition[];
}

/**
 * CE.SDK Plugin: IMG.LY Premium Assets
 *
 * Demonstrates integrating self-hosted IMG.LY premium templates:
 * - Fetching and parsing content.json manifest
 * - Creating local asset sources for finite collections
 * - Replacing {{base_url}} placeholders with actual hosting URLs
 * - Adding template assets to the asset library
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default assets and create a basic scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    // Configure the base URL where premium assets are hosted
    // This points to IMG.LY's premium templates CDN
    const baseURL = import.meta.env.VITE_CESDK_PREMIUM_TEMPLATES_URL;

    if (!baseURL) {
      throw new Error(
        'VITE_CESDK_PREMIUM_TEMPLATES_URL environment variable is required'
      );
    }

    // Fetch the content.json manifest file
    // This file lists all available templates and their metadata
    const contentJSONUrl = `${baseURL}/dist/templates/content.json`;
    const response = await fetch(contentJSONUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch content.json: ${response.statusText}`);
    }

    const content: ContentJSON = await response.json();

    // Extract the source ID and assets array from the manifest
    const { assets, id: sourceId } = content;

    // Create a local asset source for the premium templates with custom apply handler
    // Templates are archive files that need special loading
    engine.asset.addLocalSource(sourceId, [], async (asset) => {
      // Load the template from the archive URL
      await engine.scene.loadFromArchiveURL(asset.meta.uri);
      // Return the scene ID after loading
      return engine.scene.get()!;
    });

    // Process each asset and add it to the source
    assets.forEach((asset) => {
      // Replace {{base_url}} placeholders in asset metadata
      // Note: We append '/dist' to match the CDN structure
      const replacementURL = `${baseURL}/dist`;
      if (asset.meta) {
        Object.entries(asset.meta).forEach(([key, value]: [any, any]) => {
          const stringValue: string = value.toString();
          if (stringValue.includes('{{base_url}}')) {
            const updated = stringValue.replace('{{base_url}}', replacementURL);
            if (asset.meta) {
              asset.meta[key] = updated;
            }
          }
        });
      }

      // Replace {{base_url}} in payload sourceSet for responsive images
      // cSpell:ignore sourceset
      if (asset.payload?.sourceSet) {
        asset.payload.sourceSet.forEach((sourceSet) => {
          sourceSet.uri = sourceSet.uri.replace('{{base_url}}', replacementURL);
        });
      }

      // Add the processed asset to the local source
      engine.asset.addAssetToSource(sourceId, asset);
    });

    // Query and apply the second template to demonstrate the integration
    const result = await engine.asset.findAssets(sourceId, {
      page: 0,
      perPage: 2
    });

    if (result.assets.length > 1) {
      // Apply the second template - this triggers the custom applyAsset callback
      await engine.asset.apply(sourceId, result.assets[1]);
    }

    // Set translations for category labels
    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.template.premium.ly.img.template.premium1.label':
          'Templates',
        'libraries.ly.img.template.premium.ly.img.template.premium1.e-commerce.label':
          'E-Commerce',
        'libraries.ly.img.template.premium.ly.img.template.premium1.event.label':
          'Event',
        'libraries.ly.img.template.premium.ly.img.template.premium1.personal.label':
          'Personal',
        'libraries.ly.img.template.premium.ly.img.template.premium1.professional.label':
          'Professional',
        'libraries.ly.img.template.premium.ly.img.template.premium1.socials.label':
          'Socials'
      }
    });

    // Configure the asset library dock entry for premium templates
    cesdk.ui.addAssetLibraryEntry({
      id: 'ly.img.template.premium',
      sourceIds: [sourceId],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'auto'
    });

    // Add premium templates as the first button in the dock with a separator
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'premium-templates',
        label: 'Premium Templates',
        entries: ['ly.img.template.premium']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getDockOrder()
    ]);

    // Open the Premium Templates panel to showcase the feature on load
    cesdk.ui.openPanel('ly.img.assetLibrary.dock', { key: 'premium-templates' });
  }
}

export default Example;
