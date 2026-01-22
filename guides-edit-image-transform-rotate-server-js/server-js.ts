import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function rotateImagesExample() {
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

    // Demo 1: Original image (no rotation)
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

    // Demo 2: Rotate 45 degrees
    const rotated45Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated45Image);
    engine.block.setPositionX(rotated45Image, 225);
    engine.block.setPositionY(rotated45Image, 50);

    // Rotate the block by 45 degrees (π/4 radians)
    engine.block.setRotation(rotated45Image, Math.PI / 4);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', '45°');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 150);
    engine.block.setPositionX(text2, 225);
    engine.block.setPositionY(text2, 210);
    engine.block.appendChild(page, text2);

    // Demo 3: Rotate 90 degrees
    const rotated90Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated90Image);
    engine.block.setPositionX(rotated90Image, 400);
    engine.block.setPositionY(rotated90Image, 50);

    // Rotate the block by 90 degrees (π/2 radians)
    engine.block.setRotation(rotated90Image, Math.PI / 2);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', '90°');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 400);
    engine.block.setPositionY(text3, 210);
    engine.block.appendChild(page, text3);

    // Demo 4: Rotate 180 degrees
    const rotated180Image = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, rotated180Image);
    engine.block.setPositionX(rotated180Image, 575);
    engine.block.setPositionY(rotated180Image, 50);

    // Rotate the block by 180 degrees (π radians)
    engine.block.setRotation(rotated180Image, Math.PI);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', '180°');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 150);
    engine.block.setPositionX(text4, 575);
    engine.block.setPositionY(text4, 210);
    engine.block.appendChild(page, text4);

    // Demo 5: Grouped rotation
    const groupedImage1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage1);
    engine.block.setPositionX(groupedImage1, 150);
    engine.block.setPositionY(groupedImage1, 300);

    const groupedImage2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 100, height: 100 }
      }
    );
    engine.block.appendChild(page, groupedImage2);
    engine.block.setPositionX(groupedImage2, 260);
    engine.block.setPositionY(groupedImage2, 300);

    // Group blocks and rotate them together
    const groupId = engine.block.group([groupedImage1, groupedImage2]);
    engine.block.setRotation(groupId, Math.PI / 8);

    const text5 = engine.block.create('text');
    engine.block.setString(text5, 'text/text', 'Grouped');
    engine.block.setFloat(text5, 'text/fontSize', 24);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text5, 200);
    engine.block.setPositionX(text5, 150);
    engine.block.setPositionY(text5, 440);
    engine.block.appendChild(page, text5);

    // Get current rotation value
    const currentRotation = engine.block.getRotation(rotated45Image);
    console.log('Current rotation (radians):', currentRotation);
    console.log(
      'Current rotation (degrees):',
      (currentRotation * 180) / Math.PI
    );

    // Reset rotation to original orientation
    engine.block.setRotation(originalImage, 0);

    // Helpers for degree/radian conversion
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const toDegrees = (radians: number) => (radians * 180) / Math.PI;

    // Example: rotate by 30 degrees using helper
    const targetRadians = toRadians(30);
    console.log('30 degrees in radians:', targetRadians);
    console.log('Converted back to degrees:', toDegrees(targetRadians));

    // Export the result as PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('rotate-images-output.png', buffer);
    console.log('Successfully exported rotate-images-output.png');
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
rotateImagesExample();
