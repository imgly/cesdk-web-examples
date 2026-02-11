import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: URI Resolver Guide
 *
 * This example demonstrates:
 * - Understanding default URI resolution behavior
 * - Setting custom URI resolvers
 * - Adding authentication tokens
 * - Removing custom resolvers
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.96,
      g: 0.96,
      b: 0.96,
      a: 1.0
    });

    // ========================================
    // Section 1: Understanding Default URI Resolution
    // ========================================

    // Test resolution without loading assets
    const relativeURI = '/images/photo.jpg';
    const resolvedURI = engine.editor.getAbsoluteURI(relativeURI);
    // eslint-disable-next-line no-console
    console.log('Default resolution:');
    // eslint-disable-next-line no-console
    console.log(`  Input:  ${relativeURI}`);
    // eslint-disable-next-line no-console
    console.log(`  Output: ${resolvedURI}`);

    // ========================================
    // Section 2: Setting a Custom URI Resolver
    // ========================================

    // Set a custom resolver that transforms specific file types
    engine.editor.setURIResolver((uri, defaultURIResolver) => {
      // Transform JPG files to a watermarked version
      if (uri.endsWith('.jpg')) {
        // eslint-disable-next-line no-console
        console.log(`Custom resolver: Transforming ${uri}`);
        return 'https://img.ly/static/ubq_samples/sample_1.jpg';
      }
      // Use default resolver for all other URIs
      return defaultURIResolver(uri);
    });

    // Test the custom resolver
    // ========================================
    // Section 2: Adding Authentication with JWT Tokens
    // ========================================

    // Pre-generate token BEFORE setting the resolver (must be synchronous)
    const authToken = 'demo-jwt-token-123';

    // Set resolver that adds authentication to specific endpoints
    engine.editor.setURIResolver((uri, defaultURIResolver) => {
      // Only add auth token to URIs pointing to your stable link endpoint
      if (uri.includes('your-server/image-stable-links/')) {
        const authenticatedURI = `${uri}?auth=${authToken}`;
        // eslint-disable-next-line no-console
        console.log(`\nAuth resolver: Adding token to ${uri}`);
        // eslint-disable-next-line no-console
        console.log(`  Result: ${authenticatedURI}`);
        return authenticatedURI;
      }
      // Use default resolver for all other URIs
      return defaultURIResolver(uri);
    });

    // Test authentication with a protected URI
    const protectedURI = 'https://your-server/image-stable-links/abc123';
    engine.editor.getAbsoluteURI(protectedURI);

    // ========================================
    // Section 3: Removing a Custom Resolver
    // ========================================

    // Remove the custom resolver to restore default behavior
    engine.editor.setURIResolver((uri, defaultURIResolver) =>
      defaultURIResolver(uri)
    );
    // eslint-disable-next-line no-console
    console.log('\n✓ Removed custom resolver - back to default behavior');

    // ========================================
    // Visual Demonstration: Load Images
    // ========================================

    // Create a visual demonstration with actual image loading
    // This shows that the resolver affects actual asset loading, not just getAbsoluteURI()

    // Set a simple resolver for the demo
    engine.editor.setURIResolver((uri, defaultURIResolver) => {
      // For this demo, ensure all images resolve to valid URLs
      if (uri.includes('sample')) {
        return uri;
      }
      return defaultURIResolver(uri);
    });

    // Create three image blocks to demonstrate URI resolution in action
    const imageSize = { width: 200, height: 150 };
    const spacing = 40;
    const startX = (800 - (imageSize.width * 3 + spacing * 2)) / 2;
    const startY = (600 - imageSize.height) / 2;

    // Image 1: Standard resolution
    const image1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: imageSize }
    );
    engine.block.setPositionX(image1, startX);
    engine.block.setPositionY(image1, startY);
    engine.block.appendChild(page, image1);

    // Image 2: Another sample
    const image2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      { size: imageSize }
    );
    engine.block.setPositionX(image2, startX + imageSize.width + spacing);
    engine.block.setPositionY(image2, startY);
    engine.block.appendChild(page, image2);

    // Image 3: Third sample
    const image3 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      { size: imageSize }
    );
    engine.block.setPositionX(image3, startX + (imageSize.width + spacing) * 2);
    engine.block.setPositionY(image3, startY);
    engine.block.appendChild(page, image3);

    // Zoom to fit all content
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });

    // eslint-disable-next-line no-console
    console.log('\n✓ URI Resolver guide loaded successfully!');
  }
}

export default Example;
