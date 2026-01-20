import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Add to Template Library
 *
 * This example demonstrates how to create a template library by:
 * 1. Creating a local asset source for templates
 * 2. Adding templates with metadata (label, thumbnail, URI)
 * 3. Configuring the UI to display the template library
 * 4. Saving scenes as templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Add default and demo asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a local asset source for templates
    engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
      // Apply the selected template to the current scene
      await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
      // Set zoom to auto-fit after applying template
      await cesdk.actions.run('zoom.toPage', { autoFit: true });
      return undefined;
    });

    // Add a template to the source with metadata
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-postcard',
      label: { en: 'Postcard' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
      }
    });

    // Add more templates
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-business-card',
      label: { en: 'Business Card' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_business_card_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_business_card_1.jpg'
      }
    });

    engine.asset.addAssetToSource('my-templates', {
      id: 'template-social-media',
      label: { en: 'Social Media Post' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_post_1.scene',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_instagram_post_1.jpg'
      }
    });

    // Add translation for the library entry
    cesdk.i18n.setTranslations({
      en: { 'libraries.my-templates-entry.label': 'My Templates' }
    });

    // Add the template source to the asset library
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-templates-entry',
      sourceIds: ['my-templates'],
      sceneMode: 'Design',
      previewLength: 3,
      previewBackgroundType: 'cover',
      gridBackgroundType: 'cover',
      gridColumns: 2,
      cardLabelPosition: () => 'below'
    });

    // Add template library to the dock
    cesdk.ui.setDockOrder([
      ...cesdk.ui.getDockOrder(),
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-templates-dock',
        label: 'My Templates',
        icon: '@imgly/Template',
        entries: ['my-templates-entry']
      }
    ]);

    // Load the first template
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Set zoom to auto-fit
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // Open the template library panel by default
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-templates-entry'] }
    });

    // Save as string format (lightweight, references remote assets)
    const templateString = await engine.scene.saveToString();
    console.log('Template saved as string. Length:', templateString.length);

    // Save as archive format (self-contained with bundled assets)
    const templateBlob = await engine.scene.saveToArchive();
    console.log('Template saved as archive. Size:', templateBlob.size, 'bytes');

    // List all registered asset sources
    const sources = engine.asset.findAllSources();
    console.log('Registered sources:', sources);

    // Notify UI when source contents change
    engine.asset.assetSourceContentsChanged('my-templates');

    // Query templates from the source
    const queryResult = await engine.asset.findAssets('my-templates', {
      page: 0,
      perPage: 10
    });
    console.log('Templates in library:', queryResult.total);

    // Remove a template from the source
    engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
    console.log('Removed template-social-media from library');

    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportArchive.navigationBar'
      ]
    });
  }
}

export default Example;
