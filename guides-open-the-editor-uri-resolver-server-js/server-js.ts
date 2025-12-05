import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: URI Resolver
 *
 * Demonstrates URI resolution in headless mode:
 * - Understanding default URI resolution behavior
 * - Setting custom URI resolvers
 * - Adding JWT authentication tokens
 * - Removing custom resolvers
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];
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
  console.log('Default resolution:');
  console.log(`  Input:  ${relativeURI}`);
  console.log(`  Output: ${resolvedURI}`);

  // ========================================
  // Section 2: Setting a Custom URI Resolver
  // ========================================

  // Set a custom resolver that transforms specific file types
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // Transform JPG files to a watermarked version
    if (uri.endsWith('.jpg')) {
      console.log(`Custom resolver: Transforming ${uri}`);
      return 'https://img.ly/static/ubq_samples/sample_1.jpg';
    }
    // Use default resolver for all other URIs
    return defaultURIResolver(uri);
  });

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
      console.log(`\nAuth resolver: Adding token to ${uri}`);
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
  console.log('\n✓ Removed custom resolver - back to default behavior');

  console.log('\n✓ URI Resolver guide completed successfully!');

  // Create output directory
  mkdirSync('output', { recursive: true });

  // Optional: Add some images to demonstrate the resolver works with actual assets
  // Set a simple resolver for the demo
  engine.editor.setURIResolver((uri, defaultURIResolver) => {
    // For this demo, ensure all images resolve to valid URLs
    if (uri.includes('sample')) {
      return uri;
    }
    return defaultURIResolver(uri);
  });

  // Add images to show resolver works
  const imageSize = { width: 200, height: 150 };
  const image1 = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: imageSize }
  );
  engine.block.setPositionX(image1, 100);
  engine.block.setPositionY(image1, 225);
  engine.block.appendChild(page, image1);

  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync('output/uri-resolver-result.png', buffer);
  console.log('\n📄 Exported result to: output/uri-resolver-result.png');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
