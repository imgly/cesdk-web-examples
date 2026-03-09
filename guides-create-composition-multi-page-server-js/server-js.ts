import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Multi-Page Layouts
 *
 * Demonstrates programmatic multi-page layout management:
 * - Creating scenes with multiple pages
 * - Adding and configuring pages
 * - Scene layout types (HorizontalStack)
 * - Stack spacing between pages
 * - Exporting multi-page designs
 */

const engine = await CreativeEngine.init({});

try {
  // Create a scene with HorizontalStack layout
  engine.scene.create('HorizontalStack');

  // Get the stack container
  const [stack] = engine.block.findByType('stack');

  // Add spacing between pages (20 pixels in screen space)
  engine.block.setFloat(stack, 'stack/spacing', 20);
  engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

  // Create the first page
  const firstPage = engine.block.create('page');
  engine.block.setWidth(firstPage, 800);
  engine.block.setHeight(firstPage, 600);
  engine.block.appendChild(stack, firstPage);

  // Add content to the first page
  const imageBlock1 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: { width: 300, height: 200 } }
  );
  engine.block.setPositionX(imageBlock1, 250);
  engine.block.setPositionY(imageBlock1, 200);
  engine.block.appendChild(firstPage, imageBlock1);

  // Create a second page with different content
  const secondPage = engine.block.create('page');
  engine.block.setWidth(secondPage, 800);
  engine.block.setHeight(secondPage, 600);
  engine.block.appendChild(stack, secondPage);

  // Add a different image to the second page
  const imageBlock2 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 200 } }
  );
  engine.block.setPositionX(imageBlock2, 250);
  engine.block.setPositionY(imageBlock2, 200);
  engine.block.appendChild(secondPage, imageBlock2);

  // Export each page as a separate image
  mkdirSync('output', { recursive: true });
  const pages = engine.block.findByType('page');

  for (let i = 0; i < pages.length; i++) {
    const blob = await engine.block.export(pages[i], { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`output/page-${i + 1}.png`, buffer);
    console.log(`Exported page ${i + 1}`);
  }

  console.log('Multi-page layout example complete');
} finally {
  engine.dispose();
}
