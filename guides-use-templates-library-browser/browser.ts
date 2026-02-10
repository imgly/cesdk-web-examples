import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Template Library
 *
 * This example demonstrates how to configure and populate the Template Library:
 * 1. Creating custom template sources from JSON
 * 2. Handling template application with addLocalSource callback
 * 3. Querying and browsing templates programmatically
 * 4. Managing template sources
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default asset sources (fonts, etc.)
    await cesdk.addDefaultAssetSources();

    // Create a design scene to work with
    await cesdk.createDesignScene();

    // Create a custom template source with an apply callback
    // The callback handles what happens when a user clicks a template
    engine.asset.addLocalSource('my.custom.templates', undefined, async (asset) => {
      const sceneUri = asset.meta?.uri;
      const scene = engine.scene.get();
      if (!sceneUri || scene == null) return undefined;

      const sceneUrl = new URL(sceneUri, window.location.href);
      await engine.scene.applyTemplateFromURL(sceneUrl.href);

      return scene;
    });

    // Add template assets to the source
    // Each asset needs meta.uri pointing to a .scene file
    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-1',
      label: { en: 'Postcard Design' },
      tags: { en: ['postcard', 'card'] },
      groups: ['cards'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
      }
    });

    engine.asset.addAssetToSource('my.custom.templates', {
      id: 'postcard-2',
      label: { en: 'Business Card' },
      tags: { en: ['business', 'card'] },
      groups: ['business'],
      meta: {
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_2.jpg',
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene'
      }
    });

    // Create an asset library entry for the custom templates
    cesdk.ui.addAssetLibraryEntry({
      id: 'custom-templates-entry',
      sourceIds: ['my.custom.templates'],
      title: 'Custom Templates',
      icon: '@imgly/Template',
      gridColumns: 2,
      gridItemHeight: 'square'
    });

    // Configure the dock to show ONLY the custom template library
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'custom-templates',
        icon: '@imgly/Template',
        label: 'Custom Templates',
        entries: ['custom-templates-entry']
      }
    ]);

    // Open the custom templates panel on startup (same as clicking dock button)
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['custom-templates-entry']
      }
    });

    // Query templates with filtering options
    const queryResult = await engine.asset.findAssets('my.custom.templates', {
      page: 0,
      perPage: 20,
      groups: ['cards']
    });
    console.log(
      'Templates in "cards" group:',
      queryResult.assets.map((t) => t.id)
    );

    // Query all templates from custom source
    const allCustomTemplates = await engine.asset.findAssets(
      'my.custom.templates',
      {
        page: 0,
        perPage: 100
      }
    );
    console.log('Total custom templates:', allCustomTemplates.total);

    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    const templateSources = allSources.filter(
      (id) => id.includes('template') || id === 'my.custom.templates'
    );
    console.log('Template sources:', templateSources);

    // Get available groups from a source
    const groups = await engine.asset.getGroups('my.custom.templates');
    console.log('Available groups:', groups);

    // Subscribe to source changes
    const unsubscribeAdd = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log('Asset source added:', sourceId);
    });

    const unsubscribeRemove = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log('Asset source removed:', sourceId);
    });

    // Clean up subscriptions when done (for demonstration)
    setTimeout(() => {
      unsubscribeAdd();
      unsubscribeRemove();
    }, 10000);

    console.log('Template Library example loaded successfully!');
  }
}

export default Example;
