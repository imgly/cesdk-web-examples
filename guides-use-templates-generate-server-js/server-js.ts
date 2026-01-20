import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Generate From Template
 *
 * Demonstrates how to generate finished designs from templates:
 * - Loading templates from URLs
 * - Populating template variables
 * - Finding and updating placeholder content
 * - Exporting to images and PDFs
 * - Batch generation workflows
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {

    // Load a template from URL - this template has visible {{variable}} placeholders
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_2.scene'
    );
    console.log('Template loaded from URL');

    // Discover available variables in the template
    const allVariables = engine.variable.findAll();
    console.log('Available variables:', allVariables);

    // Set variable values to replace {{variableName}} placeholders
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');
    console.log('Variables populated');

    // Find all placeholder blocks in the template
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Find specific blocks by name
    const namedBlocks = engine.block.findByName('Image');
    if (namedBlocks.length > 0) {
      console.log('Found image block by name:', namedBlocks[0]);
    }

    // Update image placeholder content
    const imageBlocks = engine.block.findByName('Image');
    if (imageBlocks.length > 0) {
      const imageBlock = imageBlocks[0];
      const fill = engine.block.getFill(imageBlock);
      engine.block.setString(
        fill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_4.jpg'
      );
      console.log('Image placeholder updated');
    }

    // Export the populated template to PNG
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(`${outputDir}/greeting-card.png`, buffer);
      console.log('Exported to output/greeting-card.png');
    }

    // Export to PDF format
    const scene = engine.scene.get();
    if (scene !== null) {
      const pdfBlob = await engine.block.export(scene, {
        mimeType: 'application/pdf'
      });
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
      writeFileSync(`${outputDir}/greeting-card.pdf`, pdfBuffer);
      console.log('Exported to output/greeting-card.pdf');
    }

    // Demonstrate batch generation workflow
    // Save template for reuse
    const templateString = await engine.scene.saveToString();
    console.log('Template saved for batch processing');

    // Process multiple data records
    const dataRecords = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        city: 'Paris',
        address: '10 Rue de Rivoli'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        city: 'London',
        address: '221B Baker Street'
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        city: 'Tokyo',
        address: '1-1 Shibuya'
      }
    ];

    for (let i = 0; i < dataRecords.length; i++) {
      const record = dataRecords[i];

      // Reload template for each record
      await engine.scene.loadFromString(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      // Export each personalized version
      const batchPages = engine.block.findByType('page');
      if (batchPages.length > 0) {
        const batchPage = batchPages[0];
        const batchBlob = await engine.block.export(batchPage, {
          mimeType: 'image/png'
        });
        const batchBuffer = Buffer.from(await batchBlob.arrayBuffer());
        writeFileSync(
          `${outputDir}/batch-${record.firstName.toLowerCase()}.png`,
          batchBuffer
        );
        console.log(
          `Exported batch image for: ${record.firstName} ${record.lastName}`
        );
      }
    }

    console.log(`Batch processed ${dataRecords.length} records`);
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
