import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add a Background
 *
 * Demonstrates:
 * - Applying gradient fills to pages
 * - Adding background colors to text blocks
 * - Applying image fills to shapes
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];
  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);

  // Check if the page supports fill, then apply a pastel gradient
  if (engine.block.supportsFill(page)) {
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.85, g: 0.75, b: 0.95, a: 1.0 }, stop: 0 },
      { color: { r: 0.7, g: 0.9, b: 0.95, a: 1.0 }, stop: 1 },
    ]);
    engine.block.setFill(page, gradientFill);
  }

  // Create header text (dark, no background)
  const headerText = engine.block.create('text');
  engine.block.setString(headerText, 'text/text', 'Learn cesdk');
  engine.block.setFloat(headerText, 'text/fontSize', 12);
  engine.block.setWidth(headerText, 350);
  engine.block.setHeightMode(headerText, 'Auto');
  engine.block.setPositionX(headerText, 50);
  engine.block.setPositionY(headerText, 230);
  engine.block.setColor(headerText, 'fill/solid/color', {
    r: 0.15,
    g: 0.15,
    b: 0.2,
    a: 1.0,
  });
  engine.block.appendChild(page, headerText);

  // Create "Backgrounds" text with white background
  const featuredText = engine.block.create('text');
  engine.block.setString(featuredText, 'text/text', 'Backgrounds');
  engine.block.setFloat(featuredText, 'text/fontSize', 8);
  engine.block.setWidth(featuredText, 280);
  engine.block.setHeightMode(featuredText, 'Auto');
  // Offset X by paddingLeft (16) so background aligns with header at X=50
  engine.block.setPositionX(featuredText, 66);
  engine.block.setPositionY(featuredText, 310);
  engine.block.setColor(featuredText, 'fill/solid/color', {
    r: 0.2,
    g: 0.2,
    b: 0.25,
    a: 1.0,
  });
  engine.block.appendChild(page, featuredText);

  // Add white background color to the featured text block
  if (engine.block.supportsBackgroundColor(featuredText)) {
    engine.block.setBackgroundColorEnabled(featuredText, true);
    engine.block.setColor(featuredText, 'backgroundColor/color', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0,
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

  // eslint-disable-next-line no-console
  console.log('Page supports fill:', pageSupportsFill);
  // eslint-disable-next-line no-console
  console.log('Text supports backgroundColor:', textSupportsBackground);
  // eslint-disable-next-line no-console
  console.log('Image supports fill:', imageSupportsFill);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/add-background-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/add-background-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
