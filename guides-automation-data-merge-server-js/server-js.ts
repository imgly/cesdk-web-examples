import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Data Merge
 *
 * Demonstrates batch processing of personalized designs:
 * - Loading templates with text variables
 * - Setting variable values from data records
 * - Finding and updating placeholder blocks by name
 * - Exporting personalized designs to PNG
 * - Processing multiple records in a batch
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Sample data records for the merge operation
  // In production, this data would come from a CSV, database, or API
  const dataRecords = [
    {
      name: 'Alex Smith',
      title: 'Creative Developer',
      email: 'alex.smith@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_1.jpg'
    },
    {
      name: 'Jordan Lee',
      title: 'Product Designer',
      email: 'jordan.lee@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_2.jpg'
    },
    {
      name: 'Taylor Chen',
      title: 'UX Engineer',
      email: 'taylor.chen@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_3.jpg'
    }
  ];

  // Prepare output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Store exported blobs for batch processing results
  const outputs: { name: string; blob: Blob }[] = [];

  // Process each data record
  for (const record of dataRecords) {
    // Create a fresh scene for each record
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 400 } }
    });
    const page = engine.block.findByType('page')[0];

    // Set text variables from the data record
    engine.variable.setString('name', record.name);
    engine.variable.setString('title', record.title);
    engine.variable.setString('email', record.email);

    // Create the template layout with placeholder blocks

    // Create a profile photo block on the left
    const photoBlock = engine.block.create('graphic');
    engine.block.setShape(photoBlock, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(photoFill, 'fill/image/imageFileURI', record.photoUrl);
    engine.block.setFill(photoBlock, photoFill);
    engine.block.setWidth(photoBlock, 150);
    engine.block.setHeight(photoBlock, 150);
    engine.block.setPositionX(photoBlock, 50);
    engine.block.setPositionY(photoBlock, 125);
    engine.block.setName(photoBlock, 'profile-photo');
    engine.block.appendChild(page, photoBlock);

    // Create a text block with variable bindings
    const textBlock = engine.block.create('text');
    const textContent = `{{name}}
{{title}}
{{email}}`;
    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 32);
    engine.block.setPositionX(textBlock, 230);
    engine.block.setPositionY(textBlock, 140);
    engine.block.appendChild(page, textBlock);

    // Verify which variables exist in the scene
    const variables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log(`Processing ${record.name}, variables:`, variables);

    // Check if the text block references any variables
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    // eslint-disable-next-line no-console
    console.log(`Text block has variables: ${hasVariables}`);

    // Export the personalized design to PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });

    // Save the result
    const filename = record.name.toLowerCase().replace(/\s+/g, '-');
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}.png`, buffer);

    outputs.push({ name: record.name, blob });
    // eslint-disable-next-line no-console
    console.log(`✓ Exported ${filename}.png`);
  }

  // eslint-disable-next-line no-console
  console.log(`\n✓ Batch complete: ${outputs.length} designs exported to ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
