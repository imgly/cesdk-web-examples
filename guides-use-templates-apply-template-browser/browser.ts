import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Apply a Template
 *
 * This example demonstrates how to apply template content to an existing scene:
 * 1. Creating a scene with specific dimensions
 * 2. Applying a template from a URL while preserving dimensions
 * 3. Switching between templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a design scene with specific dimensions
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set custom page dimensions - these will be preserved when applying templates
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1920);

    // Apply a template from URL - content adjusts to fit current page dimensions
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    await engine.scene.applyTemplateFromURL(templateUrl);

    // Auto-fit zoom to page
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    console.log('Template applied from URL');

    // Verify that page dimensions are preserved after applying template
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Page dimensions preserved: ${width}x${height}`);

    // Demonstrate template switching - apply a different template
    // The page dimensions remain the same while content changes
    const alternativeTemplateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene';

    // Uncomment to switch templates:
    // await engine.scene.applyTemplateFromURL(alternativeTemplateUrl);
    // console.log('Switched to alternative template');

    // Store for potential use
    console.log('Alternative template URL:', alternativeTemplateUrl);

    console.log('Apply template example completed');
  }
}

export default Example;
