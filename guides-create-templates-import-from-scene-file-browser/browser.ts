import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Import Templates from Scene Files
 *
 * This example demonstrates:
 * - Loading scenes from .scene file URLs
 * - Loading scenes from .archive (ZIP) URLs
 * - Applying templates while preserving page dimensions
 * - Understanding the difference between loading and applying templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // ===== Example: Load Scene from Archive URL =====
    // This is the recommended approach for loading complete templates
    // with all their assets embedded in a ZIP file

    // Load a complete template from an archive (ZIP) file
    // This loads both the scene structure and all embedded assets
    await engine.scene.loadFromArchiveURL(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );

    // Alternative: Load scene from URL (.scene file)
    // This loads only the scene structure - assets must be accessible via URLs
    // Uncomment to try:
    // await engine.scene.loadFromURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    // );

    // Alternative: Apply template while preserving current page dimensions
    // This is useful when you want to load template content into an existing scene
    // with specific dimensions
    // Uncomment to try:
    // // First create a scene with specific dimensions
    // await cesdk.actions.run('scene.create', { page: { width: 1920, height: 1080, unit: 'Pixel' } });
    // const page = engine.block.findByType('page')[0];
    //
    // // Now apply template - content will be adjusted to fit
    // await engine.scene.applyTemplateFromURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    // );

    // Get the loaded scene
    const scene = engine.scene.get();
    if (scene) {
      // eslint-disable-next-line no-console
      console.log('Scene loaded successfully:', scene);

      // Get information about the loaded scene
      const pages = engine.scene.getPages();
      // eslint-disable-next-line no-console
      console.log(`Scene has ${pages.length} page(s)`);

      // Get scene mode
      const sceneMode = engine.scene.getMode();
      // eslint-disable-next-line no-console
      console.log('Scene mode:', sceneMode);

      // Get design unit
      const designUnit = engine.scene.getDesignUnit();
      // eslint-disable-next-line no-console
      console.log('Design unit:', designUnit);
    }

    // Zoom to fit the loaded content
    if (scene) {
      await engine.scene.zoomToBlock(scene, {
        padding: 40
      });
    }
  }
}

export default Example;
