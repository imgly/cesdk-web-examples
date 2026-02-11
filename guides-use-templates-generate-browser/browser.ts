import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Generate From Template Guide
 *
 * Demonstrates how to generate finished designs from templates:
 * - Loading templates from URLs
 * - Populating template variables
 * - Finding and updating placeholder content
 * - Exporting to images and creating downloadable files
 * - Batch generation workflows
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Load a template from URL - this template has visible {{variable}} placeholders
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene'
    );
    console.log(
      'Template loaded - variable placeholders like {{first_name}}, {{city}} are now visible on the canvas'
    );

    // Discover available variables in the template
    const allVariables = engine.variable.findAll();
    console.log('Available variables:', allVariables);

    // Wait 3 seconds so users can see the variable placeholders before population
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Set variable values to replace {{variableName}} placeholders
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');
    console.log('Variables populated - placeholders replaced with values');

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
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      const page = pages[0];
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      console.log('Exported to PNG:', blob.size, 'bytes');

      // Create downloadable file
      const url = URL.createObjectURL(blob);
      console.log('Download URL created:', url);
      // In a real application, you would trigger a download:
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'greeting-card.png';
      // link.click();
      // URL.revokeObjectURL(url);
    }

    // Export to PDF format
    const scene = engine.scene.get();
    if (scene !== null) {
      const pdfBlob = await engine.block.export(scene, {
        mimeType: 'application/pdf'
      });
      console.log('Exported to PDF:', pdfBlob.size, 'bytes');
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

    for (const record of dataRecords) {
      // Reload template for each record
      await engine.scene.loadFromString(templateString);

      // Populate with record data
      engine.variable.setString('first_name', record.firstName);
      engine.variable.setString('last_name', record.lastName);
      engine.variable.setString('city', record.city);
      engine.variable.setString('address', record.address);

      console.log(
        `Processed record for: ${record.firstName} ${record.lastName}`
      );
      // In a real workflow, you would export here:
      // const blob = await engine.block.export(page, { mimeType: 'image/png' });
    }

    console.log(`Batch processed ${dataRecords.length} records`);

    // Reload the original template for display
    await engine.scene.loadFromString(templateString);
    engine.variable.setString('first_name', 'Alice');
    engine.variable.setString('last_name', 'Smith');
    engine.variable.setString('city', 'Paris');
    engine.variable.setString('address', '10 Rue de Rivoli');

    console.log(
      'Generate from template guide initialized. The template demonstrates loading, variable population, and export workflows.'
    );
  }
}

export default Example;
