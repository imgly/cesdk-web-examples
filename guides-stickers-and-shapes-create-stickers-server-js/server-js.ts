import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Stickers
 *
 * Demonstrates creating stickers programmatically in Node.js:
 * - Creating stickers with createFill (manual construction)
 * - Setting sticker properties
 * - Creating multiple stickers
 * - Preserving aspect ratios
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 450, height: 250 } },
  });
  const page = engine.block.findByType('page')[0];

  // Create graphic block with image fill
  const sticker = engine.block.create('graphic');

  // Set a shape (required for graphic blocks to be visible)
  engine.block.setShape(sticker, engine.block.createShape('rect'));

  // Create and apply image fill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg'
  );
  engine.block.setFill(sticker, imageFill);

  // Set size and position (preserve aspect ratio)
  const naturalWidth = engine.block.getWidth(sticker) || 100;
  const naturalHeight = engine.block.getHeight(sticker) || 100;
  const scale = 80 / Math.max(naturalWidth, naturalHeight);
  engine.block.setWidth(sticker, naturalWidth * scale);
  engine.block.setHeight(sticker, naturalHeight * scale);
  engine.block.setPositionX(sticker, 185);
  engine.block.setPositionY(sticker, 85);

  // Prevent cropping and mark as sticker
  if (engine.block.supportsContentFillMode(sticker)) {
    engine.block.setContentFillMode(sticker, 'Contain');
  }
  engine.block.setKind(sticker, 'Sticker');

  // Add to scene
  engine.block.appendChild(page, sticker);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/create-stickers-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/create-stickers-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
