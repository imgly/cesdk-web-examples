import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { generateQRCodeDataURL } from './qr-utils';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Insert QR Code
 *
 * Demonstrates creating QR codes programmatically in Node.js using image fills.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];

  // Generate QR code as data URL image with custom colors
  const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
    width: 256,
    color: { dark: '#1a5fb4', light: '#ffffff' }
  });

  // Create graphic block with rectangle shape and image fill
  const imageQrBlock = engine.block.create('graphic');
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageQrBlock, rectShape);

  // Create image fill with QR code data URL
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
  engine.block.setFill(imageQrBlock, imageFill);

  // Set dimensions and position for image-based QR code
  const qrSize = 300;
  engine.block.setWidth(imageQrBlock, qrSize);
  engine.block.setHeight(imageQrBlock, qrSize);
  engine.block.setPositionX(imageQrBlock, 50);
  engine.block.setPositionY(imageQrBlock, 50);

  // Add to page
  engine.block.appendChild(page, imageQrBlock);

  // Export the QR code result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/qr-code.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported QR code to output/qr-code.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
