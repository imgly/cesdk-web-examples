import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Store Custom Metadata
 *
 * Demonstrates how to attach, retrieve, and manage custom metadata on design blocks:
 * - Setting metadata key-value pairs
 * - Getting metadata values by key
 * - Checking if metadata exists
 * - Listing all metadata keys
 * - Removing metadata
 * - Storing structured data as JSON
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];

    // Create an image block to attach metadata to
    const imageBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: 400, height: 300 } }
    );
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    // Set metadata key-value pairs on the block
    engine.block.setMetadata(imageBlock, 'externalId', 'asset-12345');
    engine.block.setMetadata(imageBlock, 'source', 'user-upload');
    engine.block.setMetadata(imageBlock, 'uploadedBy', 'user@example.com');
    console.log('Set metadata: externalId, source, uploadedBy');

    // Retrieve a metadata value by key
    if (engine.block.hasMetadata(imageBlock, 'externalId')) {
      const externalId = engine.block.getMetadata(imageBlock, 'externalId');
      console.log('External ID:', externalId);
    }

    // List all metadata keys on the block
    const allKeys = engine.block.findAllMetadata(imageBlock);
    console.log('All metadata keys:', allKeys);

    // Log all key-value pairs
    for (const key of allKeys) {
      const value = engine.block.getMetadata(imageBlock, key);
      console.log(`  ${key}: ${value}`);
    }

    // Store structured data as JSON
    const generationInfo = {
      source: 'ai-generated',
      model: 'stable-diffusion',
      timestamp: Date.now()
    };
    engine.block.setMetadata(
      imageBlock,
      'generationInfo',
      JSON.stringify(generationInfo)
    );

    // Retrieve and parse structured data
    const retrievedJson = engine.block.getMetadata(
      imageBlock,
      'generationInfo'
    );
    const parsedInfo = JSON.parse(retrievedJson);
    console.log('Parsed generation info:', parsedInfo);

    // Remove a metadata key
    engine.block.removeMetadata(imageBlock, 'uploadedBy');
    console.log('Removed metadata key: uploadedBy');

    // Verify the key was removed
    const hasUploadedBy = engine.block.hasMetadata(imageBlock, 'uploadedBy');
    console.log('Has uploadedBy after removal:', hasUploadedBy);

    // List remaining keys
    const remainingKeys = engine.block.findAllMetadata(imageBlock);
    console.log('Remaining metadata keys:', remainingKeys);

    console.log('Metadata operations completed successfully!');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
