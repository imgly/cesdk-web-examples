import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function resizeImagesExample() {
  let engine: CreativeEngine | null = null;

  try {
    // Initialize headless engine for programmatic creation
    engine = await CreativeEngine.init({
      // license: process.env.CESDK_LICENSE,
    });

    // Create a new scene programmatically
    const scene = engine.scene.create();

    // Create and set up the page
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);
    engine.block.appendChild(scene, page);

    // Demo 1: Absolute Sizing - Fixed dimensions
    const absoluteImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, absoluteImage);
    engine.block.setPositionX(absoluteImage, 20);
    engine.block.setPositionY(absoluteImage, 80);

    // Set explicit dimensions using setSize
    engine.block.setSize(absoluteImage, 180, 180, {
      sizeMode: 'Absolute'
    });

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Absolute');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 180);
    engine.block.setPositionX(text1, 20);
    engine.block.setPositionY(text1, 280);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Sizing - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, percentImage);
    engine.block.setPositionX(percentImage, 220);
    engine.block.setPositionY(percentImage, 80);

    // Set size mode to percentage for responsive sizing
    engine.block.setWidthMode(percentImage, 'Percent');
    engine.block.setHeightMode(percentImage, 'Percent');
    // Values 0.0 to 1.0 represent percentage of parent
    engine.block.setWidth(percentImage, 0.225);
    engine.block.setHeight(percentImage, 0.36);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 180);
    engine.block.setPositionX(text2, 220);
    engine.block.setPositionY(text2, 280);
    engine.block.appendChild(page, text2);

    // Demo 3: Resized with maintainCrop
    const cropImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, cropImage);
    engine.block.setPositionX(cropImage, 420);
    engine.block.setPositionY(cropImage, 80);

    // Resize while preserving crop settings
    engine.block.setWidth(cropImage, 180, true);
    engine.block.setHeight(cropImage, 180, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Maintain Crop');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 180);
    engine.block.setPositionX(text3, 420);
    engine.block.setPositionY(text3, 280);
    engine.block.appendChild(page, text3);

    // Get current dimensions
    const currentWidth = engine.block.getWidth(absoluteImage);
    const currentHeight = engine.block.getHeight(absoluteImage);
    const widthMode = engine.block.getWidthMode(absoluteImage);
    const heightMode = engine.block.getHeightMode(absoluteImage);
    console.log('Current dimensions:', currentWidth, 'x', currentHeight);
    console.log('Size modes:', widthMode, heightMode);

    // Get calculated frame dimensions after layout
    const frameWidth = engine.block.getFrameWidth(absoluteImage);
    const frameHeight = engine.block.getFrameHeight(absoluteImage);
    console.log('Frame dimensions:', frameWidth, 'x', frameHeight);

    // Title text at top
    const titleText = engine.block.create('text');
    engine.block.setString(titleText, 'text/text', 'Image Resize Examples');
    engine.block.setFloat(titleText, 'text/fontSize', 36);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleText, 800);
    engine.block.setPositionX(titleText, 0);
    engine.block.setPositionY(titleText, 20);
    engine.block.appendChild(page, titleText);

    // Export the result as PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('resize-images-output.png', buffer);
    console.log('✅ Successfully exported resize-images-output.png');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine to free resources
    if (engine) {
      engine.dispose();
    }
  }
}

// Run the example
resizeImagesExample();
