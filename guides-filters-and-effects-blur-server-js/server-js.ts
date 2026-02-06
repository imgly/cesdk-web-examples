import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Blur Effects
 *
 * Demonstrates applying blur effects to design elements:
 * - Checking blur support
 * - Creating and applying blur effects
 * - Configuring blur parameters for different types
 * - Enabling/disabling blur
 * - Sharing blur across blocks
 * - Exporting results
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create an image block to check blur support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if the block supports blur - graphic blocks with shapes support blur
  const supportsBlur = engine.block.supportsBlur(sampleBlock);
  console.log('Block supports blur:', supportsBlur);

  // Create a radial blur effect
  const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');

  // Configure radial blur parameters
  engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
  engine.block.setFloat(blur, 'blur/radial/radius', 100);
  engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
  engine.block.setFloat(blur, 'blur/radial/x', 0.5);
  engine.block.setFloat(blur, 'blur/radial/y', 0.5);

  // Apply the blur to the image block
  engine.block.setBlur(sampleBlock, blur);
  engine.block.setBlurEnabled(sampleBlock, true);

  // Access the applied blur and its properties
  const appliedBlur = engine.block.getBlur(sampleBlock);
  const isEnabled = engine.block.isBlurEnabled(sampleBlock);
  const blurType = engine.block.getType(appliedBlur);
  console.log('Blur type:', blurType, 'Enabled:', isEnabled);

  // Disable blur temporarily
  engine.block.setBlurEnabled(sampleBlock, false);
  console.log('Blur disabled:', !engine.block.isBlurEnabled(sampleBlock));

  // Re-enable for final export
  engine.block.setBlurEnabled(sampleBlock, true);

  // Create additional blocks to demonstrate different blur types
  // Create a uniform blur for even softening
  const uniformBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, uniformBlock);
  engine.block.setPositionX(uniformBlock, 350);

  const uniformBlur = engine.block.createBlur('//ly.img.ubq/blur/uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.6);
  engine.block.setBlur(uniformBlock, uniformBlur);
  engine.block.setBlurEnabled(uniformBlock, true);

  // Create a linear blur for gradient effect
  const linearBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, linearBlock);
  engine.block.setPositionY(linearBlock, 275);

  const linearBlur = engine.block.createBlur('//ly.img.ubq/blur/linear');
  engine.block.setFloat(linearBlur, 'blur/linear/blurRadius', 35);
  engine.block.setFloat(linearBlur, 'blur/linear/x1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/y1', 0);
  engine.block.setFloat(linearBlur, 'blur/linear/x2', 1);
  engine.block.setFloat(linearBlur, 'blur/linear/y2', 1);
  engine.block.setBlur(linearBlock, linearBlur);
  engine.block.setBlurEnabled(linearBlock, true);

  // Create a mirrored blur for tilt-shift effect
  const mirroredBlock = await engine.block.addImage(imageUri, {
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, mirroredBlock);
  engine.block.setPositionX(mirroredBlock, 350);
  engine.block.setPositionY(mirroredBlock, 275);

  const mirroredBlur = engine.block.createBlur('//ly.img.ubq/blur/mirrored');
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/blurRadius', 30);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/gradientSize', 50);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/size', 75);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x1', 0);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y1', 0.3);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/x2', 1);
  engine.block.setFloat(mirroredBlur, 'blur/mirrored/y2', 0.7);
  engine.block.setBlur(mirroredBlock, mirroredBlur);
  engine.block.setBlurEnabled(mirroredBlock, true);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/blur-effects.png', buffer);
  console.log('Exported to output/blur-effects.png');
} finally {
  engine.dispose();
}
