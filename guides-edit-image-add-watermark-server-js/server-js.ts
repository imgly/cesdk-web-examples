import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Watermark
 *
 * Demonstrates adding text and image watermarks to designs:
 * - Creating text watermarks with custom styling
 * - Creating logo watermarks using graphic blocks
 * - Positioning watermarks side by side at the bottom
 * - Applying drop shadows for visibility
 * - Exporting watermarked designs
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with custom page dimensions
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create a gradient background for the page
  const gradientFill = engine.block.createFill('gradient/linear');

  // Set a modern purple-to-cyan gradient
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 0.39, g: 0.4, b: 0.95, a: 1 }, stop: 0 }, // Indigo
    { color: { r: 0.02, g: 0.71, b: 0.83, a: 1 }, stop: 1 } // Cyan
  ]);

  // Set diagonal gradient direction (top-left to bottom-right)
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
  engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

  // Apply gradient to page
  engine.block.setFill(page, gradientFill);

  // Create a centered title text
  const titleText = engine.block.create('text');
  engine.block.setString(titleText, 'text/text', 'Add Watermark');
  engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
  engine.block.appendChild(page, titleText);

  // Style the title
  engine.block.setTextFontSize(titleText, 14);
  engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });
  engine.block.setWidthMode(titleText, 'Auto');
  engine.block.setHeightMode(titleText, 'Auto');

  // Center the title on the page
  const titleWidth = engine.block.getFrameWidth(titleText);
  const titleHeight = engine.block.getFrameHeight(titleText);
  engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleText, (pageHeight - titleHeight) / 2);

  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Set the watermark text content
  engine.block.setString(textWatermark, 'text/text', '© 2024 img.ly');

  // Left-align the text for the watermark
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Add the text block to the page
  engine.block.appendChild(page, textWatermark);

  // Set font size for the watermark
  engine.block.setTextFontSize(textWatermark, 4);

  // Set text color to white for contrast
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 });

  // Set opacity to make it semi-transparent
  engine.block.setOpacity(textWatermark, 0.8);

  // Set width mode to auto so text fits its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');

  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rect shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with a logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );

  // Apply the fill to the graphic block
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain the image within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');

  // Add to page
  engine.block.appendChild(page, logoWatermark);

  // Size the logo watermark
  const logoWidth = 80;
  const logoHeight = 50;
  engine.block.setWidth(logoWatermark, logoWidth);
  engine.block.setHeight(logoWatermark, logoHeight);

  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.8);

  // Position padding from edges
  const padding = 15;

  // Position text watermark at bottom-left
  engine.block.setPositionX(textWatermark, padding);
  engine.block.setPositionY(textWatermark, pageHeight - padding - 20);

  // Position logo watermark at top-right
  engine.block.setPositionX(logoWatermark, pageWidth - padding - logoWidth);
  engine.block.setPositionY(logoWatermark, padding);

  // Add drop shadow to text watermark for better visibility
  engine.block.setDropShadowEnabled(textWatermark, true);
  engine.block.setDropShadowOffsetX(textWatermark, 1);
  engine.block.setDropShadowOffsetY(textWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(textWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(textWatermark, 2);
  engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.5 });

  // Add drop shadow to logo watermark
  engine.block.setDropShadowEnabled(logoWatermark, true);
  engine.block.setDropShadowOffsetX(logoWatermark, 1);
  engine.block.setDropShadowOffsetY(logoWatermark, 1);
  engine.block.setDropShadowBlurRadiusX(logoWatermark, 2);
  engine.block.setDropShadowBlurRadiusY(logoWatermark, 2);
  engine.block.setDropShadowColor(logoWatermark, { r: 0, g: 0, b: 0, a: 0.5 });

  // Export the watermarked design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/watermarked-design.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported watermarked design to output/watermarked-design.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
