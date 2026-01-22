import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Add a Background Guide
 *
 * This example demonstrates:
 * - Applying gradient fills to pages
 * - Adding background colors to text blocks
 * - Applying image fills to shapes
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Create a design scene and get the page
    await cesdk.createDesignScene();
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Check if the page supports fill, then apply a pastel gradient
    if (engine.block.supportsFill(page)) {
      const gradientFill = engine.block.createFill('gradient/linear');
      engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
        { color: { r: 0.85, g: 0.75, b: 0.95, a: 1.0 }, stop: 0 },
        { color: { r: 0.7, g: 0.9, b: 0.95, a: 1.0 }, stop: 1 }
      ]);
      engine.block.setFill(page, gradientFill);
    }

    // Create header text (dark, no background)
    const headerText = engine.block.create('text');
    engine.block.setString(headerText, 'text/text', 'Learn cesdk');
    engine.block.setFloat(headerText, 'text/fontSize', 56);
    engine.block.setWidth(headerText, 350);
    engine.block.setHeightMode(headerText, 'Auto');
    engine.block.setPositionX(headerText, 50);
    engine.block.setPositionY(headerText, 230);
    engine.block.setColor(headerText, 'fill/solid/color', {
      r: 0.15,
      g: 0.15,
      b: 0.2,
      a: 1.0
    });
    engine.block.appendChild(page, headerText);

    // Create "Backgrounds" text with white background
    const featuredText = engine.block.create('text');
    engine.block.setString(featuredText, 'text/text', 'Backgrounds');
    engine.block.setFloat(featuredText, 'text/fontSize', 48);
    engine.block.setWidth(featuredText, 280);
    engine.block.setHeightMode(featuredText, 'Auto');
    // Offset X by paddingLeft (16) so background aligns with header at X=50
    engine.block.setPositionX(featuredText, 66);
    engine.block.setPositionY(featuredText, 280);
    engine.block.setColor(featuredText, 'fill/solid/color', {
      r: 0.2,
      g: 0.2,
      b: 0.25,
      a: 1.0
    });
    engine.block.appendChild(page, featuredText);

    // Add white background color to the featured text block
    if (engine.block.supportsBackgroundColor(featuredText)) {
      engine.block.setBackgroundColorEnabled(featuredText, true);
      engine.block.setColor(featuredText, 'backgroundColor/color', {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      });
      engine.block.setFloat(featuredText, 'backgroundColor/paddingLeft', 16);
      engine.block.setFloat(featuredText, 'backgroundColor/paddingRight', 16);
      engine.block.setFloat(featuredText, 'backgroundColor/paddingTop', 10);
      engine.block.setFloat(featuredText, 'backgroundColor/paddingBottom', 10);
      engine.block.setFloat(featuredText, 'backgroundColor/cornerRadius', 8);
    }

    // Create an image block on the right side
    const imageBlock = engine.block.create('graphic');
    const imageShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, imageShape);
    engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusTL', 16);
    engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusTR', 16);
    engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusBL', 16);
    engine.block.setFloat(imageShape, 'shape/rect/cornerRadiusBR', 16);
    engine.block.setWidth(imageBlock, 340);
    engine.block.setHeight(imageBlock, 400);
    engine.block.setPositionX(imageBlock, 420);
    engine.block.setPositionY(imageBlock, 100);

    // Check if the block supports fill, then apply an image fill
    if (engine.block.supportsFill(imageBlock)) {
      const imageFill = engine.block.createFill('image');
      engine.block.setString(
        imageFill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_1.jpg'
      );
      engine.block.setFill(imageBlock, imageFill);
    }
    engine.block.appendChild(page, imageBlock);

    // Create IMG.LY logo (bottom left)
    const logoBlock = engine.block.create('graphic');
    const logoShape = engine.block.createShape('rect');
    engine.block.setShape(logoBlock, logoShape);
    engine.block.setWidth(logoBlock, 100);
    engine.block.setHeight(logoBlock, 40);
    engine.block.setPositionX(logoBlock, 50);
    engine.block.setPositionY(logoBlock, 530);
    if (engine.block.supportsFill(logoBlock)) {
      const logoFill = engine.block.createFill('image');
      engine.block.setString(
        logoFill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/imgly_logo.jpg'
      );
      engine.block.setFill(logoBlock, logoFill);
    }
    engine.block.appendChild(page, logoBlock);

    // Check feature support on different blocks
    const pageSupportsFill = engine.block.supportsFill(page);
    const textSupportsBackground =
      engine.block.supportsBackgroundColor(featuredText);
    const imageSupportsFill = engine.block.supportsFill(imageBlock);

    console.log('Page supports fill:', pageSupportsFill);
    console.log('Text supports backgroundColor:', textSupportsBackground);
    console.log('Image supports fill:', imageSupportsFill);

    // Zoom to fit the page
    await engine.scene.zoomToBlock(page, {
      padding: { left: 40, top: 40, right: 40, bottom: 40 }
    });
  }
}

export default Example;
