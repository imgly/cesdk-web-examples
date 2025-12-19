import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Asset Versioning Guide
 *
 * Demonstrates how CE.SDK handles asset URLs in saved designs:
 * - How assets are stored as URL references
 * - Scene serialization vs archive export
 * - Inspecting and modifying asset URLs
 * - Strategies for versioned asset URLs
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create a design scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set up page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create an image block with a remote URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 50,
      y: 50,
      size: { width: 300, height: 200 }
    });

    // Get the fill block that contains the image URI
    const fill = engine.block.getFill(imageBlock);

    // Inspect the stored URI - this is exactly what gets saved in the scene
    const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Stored image URI:', storedUri);

    // Save the scene to a string - URLs are preserved as references
    const sceneString = await engine.scene.saveToString();
    console.log('Scene saved to string, length:', sceneString.length);

    // The scene string contains the URL reference, not the image data itself
    // This keeps the saved scene small and loads quickly

    // Alternatively, save as an archive with embedded assets
    const archiveBlob = await engine.scene.saveToArchive();
    console.log('Archive created, size:', archiveBlob.size, 'bytes');

    // Archives are self-contained - they include all asset data
    // Use archives when designs need to work offline or across environments

    // Programmatically update an asset URL (e.g., for CDN migration)
    const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
    engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

    // Verify the change
    const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
    console.log('Updated image URI:', updatedUri);

    // Find all graphic blocks to batch update their asset URLs
    const graphicBlocks = engine.block.findByType('graphic');
    console.log('Found graphic blocks:', graphicBlocks.length);

    // Iterate through blocks to inspect or update their fills
    for (const blockId of graphicBlocks) {
      const blockFill = engine.block.getFill(blockId);
      const fillType = engine.block.getType(blockFill);

      if (fillType === '//ly.img.ubq/fill/image') {
        const uri = engine.block.getString(
          blockFill,
          'fill/image/imageFileURI'
        );
        console.log('Image block found with URI:', uri);

        // Example: migrate from old CDN to new CDN
        if (uri.includes('old-cdn.example.com')) {
          const migratedUri = uri.replace(
            'old-cdn.example.com',
            'new-cdn.example.com'
          );
          engine.block.setString(
            blockFill,
            'fill/image/imageFileURI',
            migratedUri
          );
        }
      }
    }

    // Demonstrate versioned URL patterns

    // Path-based versioning: include version in the URL path
    const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
    console.log('Path-versioned URL:', pathVersionedUrl);

    // Hash-based versioning: include content hash in filename
    const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
    console.log('Hash-versioned URL:', hashVersionedUrl);

    // Query parameter versioning: append version as query string
    const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
    console.log('Query-versioned URL:', queryVersionedUrl);

    // Add a second image to make the scene more visually interesting
    const secondImageUri = 'https://img.ly/static/ubq_samples/sample_3.jpg';
    await engine.block.addImage(secondImageUri, {
      x: 400,
      y: 50,
      size: { width: 300, height: 200 }
    });

    // Select the first image block to show it in the canvas inspector
    engine.block.select(imageBlock);

    console.log(
      'Asset versioning guide initialized. Check console for URL inspection results.'
    );
  }
}

export default Example;
