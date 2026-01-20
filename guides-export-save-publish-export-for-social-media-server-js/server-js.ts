import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export for Social Media
 *
 * Demonstrates exporting an image with Instagram portrait dimensions (1080x1350).
 *
 * Note: Video export is not supported in @cesdk/node.
 * For video exports, use the CE.SDK Renderer on Linux.
 */

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
    throw new Error('No page found in scene');
  }

  // Export with Instagram portrait dimensions (4:5 aspect ratio)
  const blob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.9,
    targetWidth: 1080,
    targetHeight: 1350
  });

  // Create output directory if it doesn't exist
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Convert Blob to Buffer and save to file system
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filename = `${outputDir}/instagram-portrait.jpg`;
  writeFileSync(filename, buffer);

  console.log(
    `Exported: instagram-portrait.jpg (1080x1350, ${(blob.size / 1024).toFixed(1)} KB)`
  );
  console.log(`File saved to: ${filename}`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
