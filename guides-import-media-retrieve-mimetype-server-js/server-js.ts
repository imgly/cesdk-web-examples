import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Retrieve MIME Type
 *
 * This example demonstrates:
 * - Loading a scene archive with embedded resources
 * - Finding transient resources (buffer:// URIs) including images and fonts
 * - Retrieving the MIME type of buffer resources
 * - Relocating resources to external URLs for a clean scene export
 */

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  // Load an archive that contains embedded resources (images and fonts)
  const archiveUrl =
    'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';
  await engine.scene.loadFromArchiveURL(archiveUrl);

  // Find all transient resources (embedded media with buffer:// URIs)
  // This includes both images and fonts embedded in the archive
  const transientResources = engine.editor.findAllTransientResources();
  console.log(`Found ${transientResources.length} transient resources`);

  if (transientResources.length === 0) {
    console.log('No transient resources found in the loaded archive');
  } else {
    // Get MIME types for all resources to see what's included
    const resourcesByType: Record<string, number> = {};
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      resourcesByType[mimeType] = (resourcesByType[mimeType] || 0) + 1;
    }
    console.log('Resources by type:', resourcesByType);

    // Filter to find only image resources
    const imageResources = [];
    for (const resource of transientResources) {
      const mimeType = await engine.editor.getMimeType(resource.URL);
      if (mimeType.startsWith('image/')) {
        imageResources.push({ ...resource, mimeType });
      }
    }
    console.log(`Found ${imageResources.length} image resources`);

    // Create output directory for extracted files
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Extension map for determining file extensions
    const extensionMap: Record<string, string> = {
      // Image types
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      // Font types
      'font/ttf': '.ttf',
      'font/otf': '.otf',
      'font/woff': '.woff',
      'font/woff2': '.woff2'
    };

    // Extract and save all resources, simulating upload to storage
    const uploadedUrls: Map<string, string> = new Map();
    let fileIndex = 0;

    for (const resource of transientResources) {
      const bufferUri = resource.URL;
      // Skip internal bundle resources
      if (bufferUri.includes('bundle://ly.img.cesdk/')) continue;

      const mimeType = await engine.editor.getMimeType(bufferUri);
      const bufferLength = engine.editor.getBufferLength(bufferUri);
      const bufferData = engine.editor.getBufferData(
        bufferUri,
        0,
        bufferLength
      );

      // Determine file extension and save
      const extension = extensionMap[mimeType] || '.bin';
      const filename = `resource-${fileIndex}${extension}`;
      const outputPath = `${outputDir}/${filename}`;

      writeFileSync(outputPath, Buffer.from(bufferData));
      console.log(`Saved: ${filename} (${mimeType}, ${bufferLength} bytes)`);

      // In production, you would upload to your storage/CDN here
      // and get back a public URL. We simulate with a local file URL.
      const simulatedCdnUrl = `https://your-cdn.com/assets/${filename}`;
      uploadedUrls.set(bufferUri, simulatedCdnUrl);
      fileIndex++;
    }

    // Relocate all buffer:// URIs to their new external URLs
    // This updates the scene to reference the uploaded files instead
    for (const [bufferUri, newUrl] of uploadedUrls) {
      engine.editor.relocateResource(bufferUri, newUrl);
    }
    console.log(`Relocated ${uploadedUrls.size} resources to external URLs`);

    // Verify relocation: transient resources should now be empty
    const remainingResources = engine.editor.findAllTransientResources();
    console.log(`Remaining transient resources: ${remainingResources.length}`);

    // Export the scene - it now references external URLs instead of buffer:// URIs
    const sceneString = await engine.scene.saveToString();
    const sceneOutputPath = `${outputDir}/scene-relocated.scene`;
    writeFileSync(sceneOutputPath, sceneString);
    console.log(`Saved relocated scene to: ${sceneOutputPath}`);
  }

  console.log('\nRetrieve MIME Type example completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
