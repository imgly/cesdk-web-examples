import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

// Prompt user to confirm export
async function confirmExport(): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nExport design to PNG? [Y/n]: ', (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * CE.SDK Server Guide: Insert Images
 *
 * Demonstrates inserting images into designs:
 * - Using the convenience API (addImage)
 * - Manual construction with graphic blocks and image fills
 * - Configuring image sizing, positioning, and content fill mode
 * - Applying corner radius for rounded images
 */
async function main() {
  console.log('\n⏳ Initializing CE.SDK engine...');

  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and adding images...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }

    // Sample image URL for demonstrations
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image using the convenience API
    // This automatically creates a graphic block with rect shape and image fill
    const imageBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 50
    });
    engine.block.appendChild(page, imageBlock);
    console.log('✓ Added image using convenience API');

    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');

    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }

    // Apply corner radius to create rounded corners on an image
    const roundedBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 250,
      cornerRadius: 20
    });
    engine.block.appendChild(page, roundedBlock);
    console.log('✓ Added image with rounded corners');

    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');

    // Export the result to a file after user confirmation
    const shouldExport = await confirmExport();
    if (shouldExport) {
      console.log('\n⏳ Exporting design...');
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      const outputPath = `${outputDir}/images.png`;
      writeFileSync(outputPath, buffer);

      console.log(`\n✅ Exported result to ${outputPath}`);
    } else {
      console.log('\n⏭️ Export skipped.');
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
    console.log('🧹 Engine disposed');
  }
}

main().catch(console.error);
