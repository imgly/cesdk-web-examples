/**
 * CE.SDK Node.js Example: Import Templates from Scene Files
 *
 * This example demonstrates:
 * - Loading scenes from .scene file URLs
 * - Loading scenes from .archive (ZIP) URLs
 * - Applying templates while preserving page dimensions
 * - Understanding the difference between loading and applying templates
 * - Working with scene files programmatically in a headless environment
 */

import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const configuration = {
  userId: 'guides-user'
};

async function main() {
  // Initialize the headless creative engine
  const engine = await CreativeEngine.init(configuration);

  try {
    // ===== Example: Load Scene from Archive URL =====
    // This is the recommended approach for loading complete templates
    // with all their assets embedded in a ZIP file

    // Load a complete template from an archive (ZIP) file
    // This loads both the scene structure and all embedded assets
    await engine.scene.loadFromArchiveURL(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );

    // Get information about the loaded scene
    const scene = engine.scene.get();
    console.log(scene);
    if (scene == null) {
      throw new Error('Failed to get scene after loading');
    }

    console.log('Scene loaded successfully:', scene);

    // Get all pages in the scene
    const pages = engine.scene.getPages();
    console.log(`Scene has ${pages.length} page(s)`);

    // Get scene mode (Design or Video)
    const sceneMode = engine.scene.getMode();
    console.log('Scene mode:', sceneMode);

    // Get design unit (Pixel, Millimeter, Inch)
    const designUnit = engine.scene.getDesignUnit();
    console.log('Design unit:', designUnit);

    // Export the scene to a PNG file
    const blob = await engine.block.export(scene, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('output-from-archive.png', buffer);
    console.log('Exported scene to output-from-archive.png');

    // Alternative: Load scene from URL (.scene file)
    // This loads only the scene structure - assets must be accessible via URLs
    // Uncomment to try:
    // await engine.scene.loadFromURL(
    //   'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    // );
    //
    // // Export the loaded scene
    // const sceneFromUrl = engine.scene.get();
    // if (sceneFromUrl) {
    //   const blob2 = await engine.block.export(sceneFromUrl, 'image/png');
    //   const buffer2 = Buffer.from(await blob2.arrayBuffer());
    //   writeFileSync('output-from-url.png', buffer2);
    //   console.log('Exported scene to output-from-url.png');
    // }

    // Alternative: Apply template while preserving current page dimensions
    // This is useful when you want to load template content into an existing scene
    // with specific dimensions
    // Uncomment to try:
    // // First create a scene with specific dimensions
    // engine.scene.create();
    // const page = engine.block.findByType('page')[0];
    // engine.block.setWidth(page, 1920);
    // engine.block.setHeight(page, 1080);
    //
    // // Now apply template - content will be adjusted to fit
    // await engine.scene.applyTemplateFromURL(
    //   'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    // );
    //
    // // Export the scene with applied template
    // const appliedScene = engine.scene.get();
    // if (appliedScene) {
    //   const blob3 = await engine.block.export(appliedScene, 'image/png');
    //   const buffer3 = Buffer.from(await blob3.arrayBuffer());
    //   writeFileSync('output-applied-template.png', buffer3);
    //   console.log('Exported scene to output-applied-template.png');
    // }

    console.log('Example completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine when done
    engine.dispose();
  }
}

// Run the example
main().catch((error) => {
  console.error('Failed to run example:', error);
  process.exit(1);
});
