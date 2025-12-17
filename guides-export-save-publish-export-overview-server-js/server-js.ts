import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export Overview
 *
 * Demonstrates export options and formats:
 * - Exporting to different image formats (PNG, JPEG, WebP)
 * - Configuring format-specific options
 * - Exporting to PDF
 * - Exporting with color masks for print workflows
 * - Checking device export limits
 * - Target size control
 */

// Prompt user to select export format
async function selectFormat(): Promise<string> {
  const formats = [
    { key: '1', label: 'PNG', value: 'png' },
    { key: '2', label: 'JPEG', value: 'jpeg' },
    { key: '3', label: 'WebP', value: 'webp' },
    { key: '4', label: 'PDF', value: 'pdf' },
    { key: '5', label: 'HD PNG (1920x1080)', value: 'hd' },
    { key: '6', label: 'Color Mask (PNG + alpha)', value: 'mask' },
    { key: '7', label: 'All formats', value: 'all' }
  ];

  console.log('\nSelect export format:');
  formats.forEach((f) => console.log(`  ${f.key}) ${f.label}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter choice (1-7): ', (answer) => {
      rl.close();
      const selected = formats.find((f) => f.key === answer.trim());
      if (!selected) {
        console.error(
          `\n✗ Invalid choice: "${answer.trim()}". Please enter 1-7.`
        );
        process.exit(1);
      }
      resolve(selected.value);
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
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }
  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Get user's format selection
  const format = await selectFormat();
  console.log('');

  if (format === 'png' || format === 'all') {
    // Export to PNG with compression
    const pngBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
    });
    const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.png`, pngBuffer);
    console.log(`✓ PNG exported (${(pngBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'jpeg' || format === 'all') {
    // Export to JPEG with quality setting
    const jpegBlob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      jpegQuality: 0.9 // 0-1, higher = better quality, larger file
    });
    const jpegBuffer = Buffer.from(await jpegBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.jpg`, jpegBuffer);
    console.log(`✓ JPEG exported (${(jpegBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'webp' || format === 'all') {
    // Export to WebP with lossless quality
    const webpBlob = await engine.block.export(page, {
      mimeType: 'image/webp',
      webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
    });
    const webpBuffer = Buffer.from(await webpBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.webp`, webpBuffer);
    console.log(`✓ WebP exported (${(webpBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'pdf' || format === 'all') {
    // Export to PDF
    const pdfBlob = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
    });
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design.pdf`, pdfBuffer);
    console.log(`✓ PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'hd' || format === 'all') {
    // Export with target size
    const hdBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    const hdBuffer = Buffer.from(await hdBlob.arrayBuffer());
    writeFileSync(`${outputDir}/design-hd.png`, hdBuffer);
    console.log(`✓ HD export complete (${(hdBlob.size / 1024).toFixed(1)} KB)`);
  }

  if (format === 'mask' || format === 'all') {
    // Export with color mask - RGB values are in 0.0-1.0 range
    // Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
    const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
      page,
      1.0, // maskColorR - red component
      0.0, // maskColorG - green component
      1.0, // maskColorB - blue component (RGB: pure magenta)
      { mimeType: 'image/png' }
    );
    const maskedBuffer = Buffer.from(await maskedImage.arrayBuffer());
    const maskBuffer = Buffer.from(await alphaMask.arrayBuffer());
    writeFileSync(`${outputDir}/design-masked.png`, maskedBuffer);
    writeFileSync(`${outputDir}/design-alpha-mask.png`, maskBuffer);
    console.log(
      `✓ Color mask export: image (${(maskedImage.size / 1024).toFixed(1)} KB) + mask (${(alphaMask.size / 1024).toFixed(1)} KB)`
    );
  }

  // Check device export limits
  const maxExportSize = engine.editor.getMaxExportSize();
  const availableMemory = engine.editor.getAvailableMemory();
  console.log(`\nDevice limits:`);
  console.log(`  Max export size: ${maxExportSize}px`);
  console.log(
    `  Available memory: ${(Number(availableMemory) / 1024 / 1024).toFixed(0)} MB`
  );

  console.log('\n✓ Export completed successfully');
  console.log(`  Output files saved to: ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
