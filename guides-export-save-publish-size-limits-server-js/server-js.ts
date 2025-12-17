import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Size Limits
 *
 * Demonstrates how to configure and work with image size limits:
 * - Reading current maxImageSize setting
 * - Configuring maxImageSize for different scenarios
 * - Observing settings changes
 * - Understanding export size constraints
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Read the current maxImageSize setting
  const currentMaxImageSize = engine.editor.getSetting('maxImageSize');
  // eslint-disable-next-line no-console
  console.log(`Current maxImageSize: ${currentMaxImageSize}px`);
  // Default is 4096 pixels - safe baseline for universal compatibility

  // Subscribe to settings changes to react to configuration updates
  const unsubscribe = engine.editor.onSettingsChanged(() => {
    const newMaxImageSize = engine.editor.getSetting('maxImageSize');
    // eslint-disable-next-line no-console
    console.log(`maxImageSize changed to: ${newMaxImageSize}px`);
  });

  // Configure maxImageSize for low memory environments
  // This must be set BEFORE loading images to ensure they're downscaled
  engine.editor.setSetting('maxImageSize', 2048);
  // eslint-disable-next-line no-console
  console.log(
    `Updated maxImageSize: ${engine.editor.getSetting('maxImageSize')}px`
  );

  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  // Use sample image for demonstration
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Add an image to the page for demonstration
  // Note: In Node.js, size parameter is required (no DOM Image API)
  // The size parameter controls display dimensions, while maxImageSize controls texture loading
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 800, height: 600 },
  });
  engine.block.appendChild(page, imageBlock);

  // Position image to fill the page
  engine.block.setPositionX(imageBlock, 0);
  engine.block.setPositionY(imageBlock, 0);

  // Validate export dimensions before processing
  // Check if dimensions are safe for the server's memory and timeout constraints
  const exportWidth = engine.block.getWidth(page);
  const exportHeight = engine.block.getHeight(page);
  const maxSafeSize = 8192; // Configure based on server capabilities

  // eslint-disable-next-line no-console
  console.log(`Export dimensions: ${exportWidth}×${exportHeight}`);

  if (exportWidth > maxSafeSize || exportHeight > maxSafeSize) {
    // eslint-disable-next-line no-console
    console.warn(
      `⚠ Export dimensions (${exportWidth}×${exportHeight}) exceed safe limits (${maxSafeSize}×${maxSafeSize})`
    );
    // eslint-disable-next-line no-console
    console.warn(
      'Consider reducing dimensions or using a higher-memory server'
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('✓ Export dimensions are within safe limits');
  }

  // Export the result to PNG
  // Note: Export size is not limited by maxImageSize setting
  // Export may fail if output exceeds server memory or rendering limits
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/size-limits-result.png`, buffer);

    // eslint-disable-next-line no-console
    console.log('✓ Exported result to output/size-limits-result.png');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('Export failed:', errorMessage);

    // Check if error is size-related
    if (
      errorMessage.includes('memory') ||
      errorMessage.includes('size') ||
      errorMessage.includes('texture')
    ) {
      // eslint-disable-next-line no-console
      console.error('Size-related export failure detected');
      // eslint-disable-next-line no-console
      console.error(
        'Remediation: Reduce maxImageSize, decrease export dimensions, or use compression'
      );

      // Implement automatic retry with reduced settings
      engine.editor.setSetting('maxImageSize', 2048);
      // eslint-disable-next-line no-console
      console.log('Retrying export with reduced maxImageSize: 2048px');

      // Retry export with lower quality
      const retryBlob = await engine.block.export(page, {
        mimeType: 'image/png',
      });
      const retryBuffer = Buffer.from(await retryBlob.arrayBuffer());
      writeFileSync(`${outputDir}/size-limits-result-reduced.png`, retryBuffer);

      // eslint-disable-next-line no-console
      console.log(
        '✓ Exported reduced quality result to output/size-limits-result-reduced.png'
      );
    } else {
      throw error; // Re-throw if not size-related
    }
  }

  // Display final configuration summary
  // eslint-disable-next-line no-console
  console.log('\n=== Size Limits Configuration Summary ===');
  // eslint-disable-next-line no-console
  console.log(
    `Current maxImageSize: ${engine.editor.getSetting('maxImageSize')}px`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Page dimensions: ${engine.block.getWidth(page)}×${engine.block.getHeight(page)}`
  );
  // eslint-disable-next-line no-console
  console.log(
    `Image dimensions: ${engine.block.getWidth(imageBlock)}×${engine.block.getHeight(imageBlock)}`
  );

  // Unsubscribe from settings changes
  unsubscribe();
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
