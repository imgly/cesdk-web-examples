import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Import Design from Archive
 *
 * Demonstrates different methods to import archive files in headless mode:
 * - Loading archives from URLs (remote storage)
 * - Loading archives from the filesystem using file:// URLs
 * - Understanding archive portability
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create output directory for results
  mkdirSync('output', { recursive: true });

  // ========================================
  // Demonstration: Create Demo Archive
  // ========================================

  // First, create a demo archive to work with for the examples below
  // In production, you would load existing archives from storage

  // Start by creating a scene from an image (no preexisting scene needed)
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  await engine.scene.createFromImage(imageUrl);

  // Save this scene as an archive
  const demoArchiveBlob = await engine.scene.saveToArchive();

  // Save the archive to filesystem for demonstration
  const archiveBuffer = Buffer.from(await demoArchiveBlob.arrayBuffer());
  const archivePath = path.resolve('output/demo-archive.zip');
  writeFileSync(archivePath, archiveBuffer);

  console.log('✓ Created demo archive: output/demo-archive.zip');

  // ========================================
  // Demonstration 1: Load Archive from Filesystem
  // ========================================

  // In Node.js environments, load archives from the filesystem using file:// URLs
  // This is common for batch processing or server-side workflows

  // Convert filesystem path to file:// URL
  const archiveFileUrl = `file://${archivePath}`;

  // Load the archive using the file URL
  await engine.scene.loadFromArchiveURL(archiveFileUrl);

  console.log('✓ Archive loaded from filesystem successfully');

  // ========================================
  // Demonstration 2: Load Archive from Remote URL
  // ========================================

  // When you have an archive hosted on a remote server, CDN, or cloud storage,
  // load it directly using its URL

  const loadArchiveFromUrl = async (url: string): Promise<void> => {
    try {
      await engine.scene.loadFromArchiveURL(url);
      console.log('✓ Archive loaded from URL successfully');
    } catch (error) {
      console.error('Failed to load archive from URL:', error);
      throw error;
    }
  };

  // Demonstrate loading from the local file URL we created earlier
  await loadArchiveFromUrl(archiveFileUrl);

  // ========================================
  // Demonstration 3: Verify Archive Contents
  // ========================================

  // After loading an archive, verify the scene and its contents

  // Find all blocks in the loaded scene
  const pages = engine.block.findByType('page');
  const graphics = engine.block.findByType('graphic');
  const texts = engine.block.findByType('text');

  console.log('\nArchive contents:');
  console.log(`  Pages: ${pages.length}`);
  console.log(`  Graphics: ${graphics.length}`);
  console.log(`  Text blocks: ${texts.length}`);

  // All assets are bundled, so no external URLs are needed
  // This makes archives ideal for portability

  // ========================================
  // Demonstration 4: Modify and Re-export
  // ========================================

  // Modify the loaded scene and export it
  const page = pages[0];
  if (page) {
    // Example: Adjust properties of text blocks
    texts.forEach((textBlock) => {
      // Make all text slightly larger
      const currentSize = engine.block.getFloat(textBlock, 'text/fontSize');
      engine.block.setFloat(textBlock, 'text/fontSize', currentSize * 1.1);
    });

    // Export the modified scene
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 800,
      targetHeight: 600
    });
    const exportBuffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/modified-archive-result.png', exportBuffer);

    console.log(
      '✓ Modified scene exported to: output/modified-archive-result.png'
    );
  }

  // ========================================
  // Demonstration 5: Create New Archive
  // ========================================

  // Save the modified scene as a new archive
  const newArchiveBlob = await engine.scene.saveToArchive();
  const newArchiveBuffer = Buffer.from(await newArchiveBlob.arrayBuffer());
  writeFileSync('output/modified-archive.zip', newArchiveBuffer);

  console.log('✓ New archive saved to: output/modified-archive.zip');

  // Archives are perfect for:
  // - Sharing designs between systems
  // - Offline editing workflows
  // - Backup and versioning
  // - Ensuring all assets are available

  console.log('\n✓ Import from Archive guide completed successfully!');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
