import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import packageJson from './package.json';

/**
 * CE.SDK Browser Guide: Remove Background with Plugin
 *
 * Demonstrates adding and configuring the background removal plugin
 * for the CE.SDK editor with various UI placement options.
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    // Get page and set dimensions
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Add the background removal plugin with canvas menu button
    await cesdk.addPlugin(
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );

    // Create a gradient background (deep teal to soft purple)
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { stop: 0, color: { r: 0.08, g: 0.22, b: 0.35, a: 1 } }, // Deep teal
      { stop: 1, color: { r: 0.35, g: 0.2, b: 0.45, a: 1 } } // Soft purple
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered title text
    const titleBlock = engine.block.create('text');
    engine.block.setString(titleBlock, 'text/text', 'Remove Background');
    engine.block.setFloat(titleBlock, 'text/fontSize', 140);
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);
    engine.block.setTextColor(titleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Create image block with a portrait photo
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setContentFillMode(imageBlock, 'Cover');

    const imageWidth = 202;
    const imageHeight = 230;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);
    engine.block.appendChild(page, imageBlock);

    // Create img.ly logo at bottom center
    const logoBlock = engine.block.create('graphic');
    const logoShape = engine.block.createShape('rect');
    engine.block.setShape(logoBlock, logoShape);

    const logoFill = engine.block.createFill('image');
    engine.block.setString(
      logoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(logoBlock, logoFill);
    engine.block.setContentFillMode(logoBlock, 'Contain');

    const logoWidth = 72;
    const logoHeight = 45;
    engine.block.setWidth(logoBlock, logoWidth);
    engine.block.setHeight(logoBlock, logoHeight);
    engine.block.setOpacity(logoBlock, 0.9);
    engine.block.appendChild(page, logoBlock);

    // Position elements
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    const imageGap = 30;
    const padding = 20;

    // Calculate vertical layout - title and image centered
    const totalContentHeight = titleHeight + imageGap + imageHeight;
    const startY = (pageHeight - totalContentHeight) / 2;

    // Position title at top of content area
    engine.block.setPositionX(titleBlock, 0);
    engine.block.setPositionY(titleBlock, startY);

    // Position image centered below title
    engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, startY + titleHeight + imageGap);

    // Position logo at bottom center
    engine.block.setPositionX(logoBlock, (pageWidth - logoWidth) / 2);
    engine.block.setPositionY(logoBlock, pageHeight - logoHeight - padding);

    // Select the image to show the canvas menu with BG Removal button
    engine.block.select(imageBlock);

    // Zoom to fit
    await engine.scene.zoomToBlock(page, { padding: 40 });
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
