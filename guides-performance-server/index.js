import CreativeEngine from '@cesdk/node';
import fs from 'fs/promises';

/**
 * Format bytes to human-readable string.
 * Handles both number and BigInt values from memory APIs.
 */
function formatBytes(bytes) {
  // Convert BigInt to Number for math operations
  const numBytes = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (numBytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Demonstrates lazy loading the engine using dynamic imports.
 * This pattern reduces cold start time in serverless environments.
 */
async function loadCreativeEngine() {
  console.log('Lazy loading CreativeEngine...');
  const startTime = Date.now();

  // Dynamic import - engine module is loaded only when this function is called
  const module = await import('@cesdk/node');
  const CreativeEngine = module.default;

  const loadTime = Date.now() - startTime;
  console.log(`CreativeEngine loaded in ${loadTime}ms`);

  return CreativeEngine;
}

/**
 * Monitor and log memory usage statistics.
 * Converts BigInt values to Number for arithmetic operations.
 */
function logMemoryStats(engine, label) {
  const usedMemory = engine.editor.getUsedMemory();
  const availableMemory = engine.editor.getAvailableMemory();
  // Convert to Number for arithmetic (memory APIs may return BigInt)
  const usedNum = Number(usedMemory);
  const availableNum = Number(availableMemory);
  const totalMemory = usedNum + availableNum;
  const usagePercentage = ((usedNum / totalMemory) * 100).toFixed(2);

  console.log(`\n=== Memory Stats: ${label} ===`);
  console.log(`  Used:      ${formatBytes(usedMemory)}`);
  console.log(`  Available: ${formatBytes(availableMemory)}`);
  console.log(`  Usage:     ${usagePercentage}%`);

  return { usedMemory, availableMemory, usagePercentage };
}

/**
 * Check device export capabilities before processing
 */
function checkExportCapabilities(engine) {
  const maxExportSize = engine.editor.getMaxExportSize();
  console.log(`\nMax export size: ${maxExportSize} pixels`);
  return maxExportSize;
}

/**
 * Process a design with memory monitoring
 */
async function processDesign(engine) {
  console.log('\n--- Processing Design ---');

  // Create a design scene
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  logMemoryStats(engine, 'After scene creation');

  // Add a graphic block with an image
  const graphic = engine.block.create('graphic');
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(graphic, rectShape);

  engine.block.setPositionX(graphic, 100);
  engine.block.setPositionY(graphic, 50);
  engine.block.setWidth(graphic, 600);
  engine.block.setHeight(graphic, 400);

  // Add image fill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(graphic, imageFill);
  engine.block.setEnum(graphic, 'contentFill/mode', 'Cover');
  engine.block.appendChild(page, graphic);

  // Wait for image to load
  console.log('Loading image asset...');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logMemoryStats(engine, 'After adding image');

  // Add text block
  const textBlock = engine.block.create('text');
  engine.block.appendChild(page, textBlock);
  engine.block.setPositionX(textBlock, 100);
  engine.block.setPositionY(textBlock, 480);
  engine.block.setWidth(textBlock, 600);
  engine.block.setHeight(textBlock, 80);
  engine.block.setString(textBlock, 'text/text', 'Performance Demo - Server');
  engine.block.setFloat(textBlock, 'text/fontSize', 48);
  engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');

  logMemoryStats(engine, 'After adding text');

  return page;
}

/**
 * Export the design with timeout configuration
 */
async function exportDesign(engine, page) {
  console.log('\n--- Exporting Design ---');

  // Configure export timeouts for reliability
  engine.unstable_setExportInactivityTimeout(30_000);
  engine.unstable_setVideoExportInactivityTimeout(60_000);
  console.log('Export timeouts configured (30s image, 60s video)');

  // Check export size limits
  const maxSize = checkExportCapabilities(engine);
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  if (pageWidth > maxSize || pageHeight > maxSize) {
    console.error('Design exceeds maximum export size!');
    return null;
  }

  // Export to PNG
  console.log('Exporting to PNG...');
  const startTime = Date.now();
  const blob = await engine.block.export(page, 'image/png');
  const exportTime = Date.now() - startTime;
  console.log(`Export completed in ${exportTime}ms`);

  return blob;
}

/**
 * Save exported content to file
 */
async function saveOutput(blob, filename) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  await fs.mkdir('output', { recursive: true });
  const outputPath = `output/${filename}`;
  await fs.writeFile(outputPath, buffer);
  console.log(`Saved to ${outputPath}`);
  return outputPath;
}

/**
 * Main demonstration function
 */
async function main() {
  console.log('='.repeat(50));
  console.log('CE.SDK Performance Guide - Server Demo');
  console.log('='.repeat(50));

  // Demonstrate lazy loading
  const CreativeEngine = await loadCreativeEngine();

  // Initialize the engine with minimal configuration
  const config = {
    license: process.env.CESDK_LICENSE || '',
    logger: (level, ...args) => {
      if (level === 'error' || level === 'warn') {
        console.log(`[${level}]`, ...args);
      }
    }
  };

  console.log('\nInitializing engine...');
  const initStart = Date.now();
  const engine = await CreativeEngine.init(config);
  const initTime = Date.now() - initStart;
  console.log(`Engine initialized in ${initTime}ms`);

  try {
    // Log initial memory state
    logMemoryStats(engine, 'Initial state');

    // Process a design
    const page = await processDesign(engine);

    // Export the design
    const blob = await exportDesign(engine, page);

    if (blob) {
      await saveOutput(blob, 'performance-demo.png');
    }

    // Final memory stats
    logMemoryStats(engine, 'Before disposal');
  } finally {
    // Always dispose the engine to free resources
    console.log('\n--- Cleanup ---');
    console.log('Disposing engine...');
    engine.dispose();
    console.log('Engine disposed successfully');
  }

  console.log('\n' + '='.repeat(50));
  console.log('Demo complete!');
  console.log('='.repeat(50));
}

// Run the demo
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
