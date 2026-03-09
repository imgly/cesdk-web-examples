import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function moveImagesExample() {
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

    // Demo 1: Movable Image - Can be freely repositioned by user
    const movableImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, movableImage);
    engine.block.setPositionX(movableImage, 50);
    engine.block.setPositionY(movableImage, 150);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Movable');
    engine.block.setFloat(text1, 'text/fontSize', 32);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 360);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Positioning - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, percentImage);

    // Set position mode to percentage (0.0 to 1.0)
    engine.block.setPositionXMode(percentImage, 'Percent');
    engine.block.setPositionYMode(percentImage, 'Percent');

    // Position at 37.5% from left (300px), 30% from top (150px)
    engine.block.setPositionX(percentImage, 0.375);
    engine.block.setPositionY(percentImage, 0.3);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 32);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 360);
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Image - Cannot be moved, rotated, or scaled
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 550);
    engine.block.setPositionY(lockedImage, 150);

    // Lock the transform to prevent user interaction
    engine.block.setBool(lockedImage, 'transformLocked', true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 32);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 360);
    engine.block.appendChild(page, text3);

    // Get current position values
    const currentX = engine.block.getPositionX(movableImage);
    const currentY = engine.block.getPositionY(movableImage);
    console.log('Current position:', currentX, currentY);

    // Move relative to current position
    // const offsetX = engine.block.getPositionX(movableImage);
    // const offsetY = engine.block.getPositionY(movableImage);
    // engine.block.setPositionX(movableImage, offsetX + 50);
    // engine.block.setPositionY(movableImage, offsetY + 50);

    // Save the scene for later use or rendering
    const sceneString = await engine.scene.saveToString();

    // Ensure output directory exists
    if (!existsSync('output')) {
      mkdirSync('output');
    }

    writeFileSync('output/move-images-scene.json', sceneString);
    console.log('Saved to output/move-images-scene.json');
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
moveImagesExample();
