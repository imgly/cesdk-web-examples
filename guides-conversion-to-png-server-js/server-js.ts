import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Convert to PNG
 *
 * This example demonstrates:
 * - Exporting programmatically with the engine API
 * - All available PNG export options
 * - Saving exported files to disk
 */

// Interactive menu to select which exports to run
async function selectExports(): Promise<string[]> {
  const options = [
    { key: '1', name: 'basic', label: 'Basic PNG export' },
    { key: '2', name: 'compressed', label: 'Compressed PNG (level 9)' },
    { key: '3', name: 'dimensions', label: 'HD PNG (1920x1080)' },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log(
      '\nSelect exports to run (comma-separated, or press Enter for all):'
    );
    options.forEach((opt) => console.log(`  ${opt.key}. ${opt.label}`));

    rl.question('\nYour choice: ', (answer) => {
      rl.close();

      if (!answer.trim()) {
        // Default: run all exports
        resolve(options.map((opt) => opt.name));
        return;
      }

      const selected = answer
        .split(',')
        .map((s) => s.trim())
        .map((key) => options.find((opt) => opt.key === key)?.name)
        .filter((name): name is string => name !== undefined);

      resolve(selected.length > 0 ? selected : options.map((opt) => opt.name));
    });
  });
}

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  // Add default asset sources so assets in the scene can be resolved
  await engine.addDefaultAssetSources();

  // Load a template scene from a remote URL
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Get the first page
  const page = engine.block.findByType('page')[0];
  if (page == null) {
    throw new Error('No page found');
  }

  // Select which exports to run
  const selectedExports = await selectExports();
  const blobs: { name: string; blob: Blob }[] = [];

  if (selectedExports.includes('basic')) {
    console.log('Exporting design.png...');
    // Export a block to PNG
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    blobs.push({ name: 'design.png', blob });
  }

  if (selectedExports.includes('compressed')) {
    console.log('Exporting design-compressed.png...');
    // Export with compression level (0-9)
    // Higher values produce smaller files but take longer
    // Quality is not affected since PNG is lossless
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9 // Maximum compression
    });

    blobs.push({ name: 'design-compressed.png', blob });
  }

  if (selectedExports.includes('dimensions')) {
    console.log('Exporting design-hd.png...');
    // Export with target dimensions
    // The block scales to fill the target while maintaining aspect ratio
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    blobs.push({ name: 'design-hd.png', blob });
  }

  // Save exported blobs to disk
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  for (const { name, blob } of blobs) {
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${name}`, buffer);
    console.log(`✓ Exported ${name} (${(blob.size / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n✓ Exported ${blobs.length} PNG file(s) to ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
