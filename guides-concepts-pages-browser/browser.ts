import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Pages Guide
 *
 * Demonstrates working with pages in CE.SDK:
 * - Understanding the scene hierarchy (Scene → Pages → Blocks)
 * - Creating and managing multiple pages
 * - Setting page dimensions at the scene level
 * - Configuring page properties (margins, title templates, fills)
 * - Navigating between pages
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Create a scene with VerticalStack layout for multi-page designs
    engine.scene.create('VerticalStack');

    // Get the stack container to configure spacing
    const [stack] = engine.block.findByType('stack');
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Get the scene to set page dimensions
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    // Set page dimensions at the scene level (all pages share these dimensions)
    engine.block.setFloat(scene, 'scene/pageDimensions/width', 800);
    engine.block.setFloat(scene, 'scene/pageDimensions/height', 600);

    // Create the first page and set its dimensions
    const firstPage = engine.block.create('page');
    engine.block.setWidth(firstPage, 800);
    engine.block.setHeight(firstPage, 600);
    engine.block.appendChild(stack, firstPage);

    // Create the second page with the same dimensions
    const secondPage = engine.block.create('page');
    engine.block.setWidth(secondPage, 800);
    engine.block.setHeight(secondPage, 600);
    engine.block.appendChild(stack, secondPage);

    // Add an image block to the first page
    const imageBlock = engine.block.create('graphic');
    engine.block.appendChild(firstPage, imageBlock);

    // Create a rect shape for the graphic block
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Configure size and position after appending to the page
    engine.block.setWidth(imageBlock, 400);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    // Create and configure the image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    // Add a text block to the second page
    const textBlock = engine.block.create('text');
    engine.block.appendChild(secondPage, textBlock);

    // Configure text properties after appending to the page
    engine.block.replaceText(textBlock, 'Page 2');
    engine.block.setTextFontSize(textBlock, 48);
    engine.block.setTextColor(textBlock, { r: 0.2, g: 0.2, b: 0.2, a: 1.0 });
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Center the text on the page
    const textWidth = engine.block.getFrameWidth(textBlock);
    const textHeight = engine.block.getFrameHeight(textBlock);
    engine.block.setPositionX(textBlock, (800 - textWidth) / 2);
    engine.block.setPositionY(textBlock, (600 - textHeight) / 2);

    // Configure page properties on the first page
    // Enable and set margins for print bleed
    engine.block.setBool(firstPage, 'page/marginEnabled', true);
    engine.block.setFloat(firstPage, 'page/margin/top', 10);
    engine.block.setFloat(firstPage, 'page/margin/bottom', 10);
    engine.block.setFloat(firstPage, 'page/margin/left', 10);
    engine.block.setFloat(firstPage, 'page/margin/right', 10);

    // Set a custom title template for the first page
    engine.block.setString(firstPage, 'page/titleTemplate', 'Cover');

    // Set a custom title template for the second page
    engine.block.setString(secondPage, 'page/titleTemplate', 'Content');

    // Set a background fill on the second page
    const colorFill = engine.block.createFill('color');
    engine.block.setColor(colorFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(secondPage, colorFill);

    // Demonstrate finding pages
    const allPages = engine.scene.getPages();
    console.log('All pages:', allPages);
    console.log('Number of pages:', allPages.length);

    // Get the current page (nearest to viewport center or containing selection)
    const currentPage = engine.scene.getCurrentPage();
    console.log('Current page:', currentPage);

    // Alternative: Find pages using block API
    const pagesByType = engine.block.findByType('page');
    console.log('Pages found by type:', pagesByType);

    // Check the scene mode (Design vs Video)
    const sceneMode = engine.scene.getMode();
    console.log('Scene mode:', sceneMode);

    // Select the first page and zoom to fit
    engine.block.select(firstPage);
    engine.scene.enableZoomAutoFit(firstPage, 'Both');

    console.log('Pages guide initialized with a 2-page design.');
  }
}

export default Example;
