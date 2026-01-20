import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

/**
 * CE.SDK Server Guide: Export to WebP
 *
 * Demonstrates:
 * - Interactive format selection
 * - Export with quality options
 * - Loading indicators
 * - Saving to output directory
 */

// Prompt user for input
async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Loading spinner
function showLoading(message: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${message}`);
  }, 80);
  return () => {
    clearInterval(interval);
    process.stdout.write('\r');
  };
}

// Display format options
console.log('\n🖼️  CE.SDK WebP Export\n');
console.log('Select export quality:');
console.log('  1. Lossy (0.8) - Smaller file, good quality');
console.log('  2. High (0.95) - Balanced quality and size');
console.log('  3. Lossless (1.0) - Perfect quality, larger file\n');

const choice = await prompt('Enter choice (1-3): ');

const qualityMap: Record<string, { quality: number; name: string }> = {
  '1': { quality: 0.8, name: 'lossy' },
  '2': { quality: 0.95, name: 'high' },
  '3': { quality: 1.0, name: 'lossless' }
};

const selected = qualityMap[choice] || qualityMap['1'];
console.log(`\nSelected: ${selected.name} (quality: ${selected.quality})\n`);

// Initialize engine with loading indicator
const stopLoading = showLoading('Initializing CE.SDK engine...');

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

stopLoading();
console.log('✓ Engine initialized\n');

try {
  await engine.addDefaultAssetSources();

  const stopSceneLoading = showLoading('Loading template...');
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  stopSceneLoading();
  console.log('✓ Template loaded\n');

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export to WebP with selected quality
  const stopExport = showLoading('Exporting to WebP...');
  const webpBlob = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: selected.quality
  });
  stopExport();

  // Save to output directory
  const buffer = Buffer.from(await webpBlob.arrayBuffer());
  const filename = `design-${selected.name}.webp`;
  writeFileSync(`${outputDir}/${filename}`, buffer);

  console.log(`✓ Exported: ${outputDir}/${filename}`);
  console.log(`  Size: ${(webpBlob.size / 1024).toFixed(1)} KB\n`);

  // Export with target dimensions
  const resizedBlob = await engine.block.export(page, {
    mimeType: 'image/webp',
    webpQuality: selected.quality,
    targetWidth: 1200,
    targetHeight: 630
  });

  const resizedBuffer = Buffer.from(await resizedBlob.arrayBuffer());
  writeFileSync(`${outputDir}/design-resized.webp`, resizedBuffer);
  console.log(`✓ Exported: ${outputDir}/design-resized.webp (1200x630)`);
  console.log(`  Size: ${(resizedBlob.size / 1024).toFixed(1)} KB\n`);
} finally {
  engine.dispose();
}
