import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import VectorizerPlugin from '@imgly/plugin-vectorizer-web';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Vectorize Images Guide
 *
 * Demonstrates converting raster images to vector graphics:
 * - Using the vectorizer plugin for UI-based conversion
 * - Programmatically vectorizing with createCutoutFromBlocks()
 * - Configuring threshold parameters for quality control
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load asset sources for the editor
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Add the vectorizer plugin with configuration options
    await cesdk.addPlugin(
      VectorizerPlugin({
        // Display the vectorize button in the canvas menu
        ui: { locations: 'canvasMenu' },
        // Set processing timeout to 30 seconds
        timeout: 30000,
        // Combine paths into a single shape when exceeding 500 paths
        groupingThreshold: 500
      })
    );

    // Show only the vectorizer button in the canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, ['@imgly/plugin-vectorizer-web.canvasMenu']);

    // Create a design scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create an image block to vectorize
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Load a sample image with clear contours for vectorization
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setContentFillMode(imageBlock, 'Contain');

    // Center the image on the page
    const imageWidth = 400;
    const imageHeight = 300;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);
    engine.block.setPositionX(imageBlock, (800 - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, (600 - imageHeight) / 2);
    engine.block.appendChild(page, imageBlock);

    // Select the image to reveal the vectorize button in the canvas menu
    engine.block.select(imageBlock);

    // Zoom to fit the page in view
    await engine.scene.zoomToBlock(page, { padding: 40 });
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
