import CreativeEngine from '@cesdk/node';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize the Creative Engine in headless mode
  const engine = await CreativeEngine.init({
    license: process.env.CESDK_LICENSE || 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    // Create a new scene with a design page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create a background image block as the base layer
    const backgroundBlock = engine.block.create('graphic');
    engine.block.setWidth(backgroundBlock, 800);
    engine.block.setHeight(backgroundBlock, 600);
    engine.block.setPositionX(backgroundBlock, 0);
    engine.block.setPositionY(backgroundBlock, 0);

    // Set the image fill for the background
    const backgroundFill = engine.block.createFill('image');
    engine.block.setString(
      backgroundFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(backgroundBlock, backgroundFill);
    engine.block.appendChild(page, backgroundBlock);

    // Create a second image block on top for blending
    const overlayBlock = engine.block.create('graphic');
    engine.block.setWidth(overlayBlock, 800);
    engine.block.setHeight(overlayBlock, 600);
    engine.block.setPositionX(overlayBlock, 0);
    engine.block.setPositionY(overlayBlock, 0);

    // Set a different image fill for the overlay
    const overlayFill = engine.block.createFill('image');
    engine.block.setString(
      overlayFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    engine.block.setFill(overlayBlock, overlayFill);
    engine.block.appendChild(page, overlayBlock);

    // Check if the block supports blend modes before applying
    if (engine.block.supportsBlendMode(overlayBlock)) {

      // Apply the Multiply blend mode to the overlay
      engine.block.setBlendMode(overlayBlock, 'Multiply');

      // Retrieve and log the current blend mode
      const currentMode = engine.block.getBlendMode(overlayBlock);
      console.log('Current blend mode:', currentMode);
    }

    // Check if the block supports opacity
    if (engine.block.supportsOpacity(overlayBlock)) {
      // Set the opacity to 70%
      engine.block.setOpacity(overlayBlock, 0.7);
    }

    // Retrieve and log the opacity value
    const opacity = engine.block.getOpacity(overlayBlock);
    console.log('Current opacity:', opacity);

    // Export the blended composition to a PNG file
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('output.png', buffer);
    console.log('Exported blended composition to output.png');
  } finally {
    // Always dispose of the engine when done
    engine.dispose();
  }
}

main().catch(console.error);
