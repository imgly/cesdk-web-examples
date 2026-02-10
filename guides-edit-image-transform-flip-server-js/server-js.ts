import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function flipImagesExample() {
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

    // Demo 1: Original image (no flip)
    const originalImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, originalImage);
    engine.block.setPositionX(originalImage, 50);
    engine.block.setPositionY(originalImage, 50);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Original');
    engine.block.setFloat(text1, 'text/fontSize', 24);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 150);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 210);
    engine.block.appendChild(page, text1);

    // Demo 2: Horizontal flip
    const horizontalFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, horizontalFlipImage);
    engine.block.setPositionX(horizontalFlipImage, 225);
    engine.block.setPositionY(horizontalFlipImage, 50);

    // Flip the block horizontally (mirrors left to right)
    engine.block.setFlipHorizontal(horizontalFlipImage, true);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Horizontal');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 150);
    engine.block.setPositionX(text2, 225);
    engine.block.setPositionY(text2, 210);
    engine.block.appendChild(page, text2);

    // Demo 3: Vertical flip
    const verticalFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, verticalFlipImage);
    engine.block.setPositionX(verticalFlipImage, 400);
    engine.block.setPositionY(verticalFlipImage, 50);

    // Flip the block vertically (mirrors top to bottom)
    engine.block.setFlipVertical(verticalFlipImage, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Vertical');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 400);
    engine.block.setPositionY(text3, 210);
    engine.block.appendChild(page, text3);

    // Demo 4: Both flips combined
    const bothFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, bothFlipImage);
    engine.block.setPositionX(bothFlipImage, 575);
    engine.block.setPositionY(bothFlipImage, 50);

    // Combine horizontal and vertical flips
    engine.block.setFlipHorizontal(bothFlipImage, true);
    engine.block.setFlipVertical(bothFlipImage, true);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', 'Both');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 150);
    engine.block.setPositionX(text4, 575);
    engine.block.setPositionY(text4, 210);
    engine.block.appendChild(page, text4);

    // Demo 5: Crop flip (flips content within the crop frame)
    const cropFlipImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, cropFlipImage);
    engine.block.setPositionX(cropFlipImage, 225);
    engine.block.setPositionY(cropFlipImage, 280);

    // Flip the content within the crop frame (not the block itself)
    engine.block.flipCropHorizontal(cropFlipImage);

    const text5 = engine.block.create('text');
    engine.block.setString(text5, 'text/text', 'Crop Flip');
    engine.block.setFloat(text5, 'text/fontSize', 24);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text5, 150);
    engine.block.setPositionX(text5, 225);
    engine.block.setPositionY(text5, 440);
    engine.block.appendChild(page, text5);

    // Get current flip state
    const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipImage);
    const isFlippedV = engine.block.getFlipVertical(verticalFlipImage);
    console.log(`Horizontal flip state: ${isFlippedH}`);
    console.log(`Vertical flip state: ${isFlippedV}`);

    // Toggle flip by reading current state and setting opposite
    const currentFlip = engine.block.getFlipHorizontal(originalImage);
    engine.block.setFlipHorizontal(originalImage, !currentFlip);
    // Toggle back for demo purposes
    engine.block.setFlipHorizontal(originalImage, currentFlip);

    // Export the result as PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('flip-images-output.png', buffer);
    console.log('Successfully exported flip-images-output.png');
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
flipImagesExample();
