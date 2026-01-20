import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Replace Content Guide
 *
 * Demonstrates how to dynamically replace content in templates:
 * - Finding placeholder blocks by name
 * - Using text variables for dynamic content
 * - Replacing image sources
 * - Building data-driven template workflows
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
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create a text block with a name for later retrieval
    const headerText = engine.block.create('text');
    engine.block.setName(headerText, 'header-text');
    engine.block.replaceText(headerText, 'Welcome, {{userName}}!');
    engine.block.setTextFontSize(headerText, 96);
    engine.block.setWidthMode(headerText, 'Auto');
    engine.block.setHeightMode(headerText, 'Auto');
    engine.block.appendChild(page, headerText);
    engine.block.setPositionX(headerText, 50);
    engine.block.setPositionY(headerText, 30);

    // Find the block by its name
    const [foundHeader] = engine.block.findByName('header-text');
    console.log('Found header block:', foundHeader);

    // Enable placeholder behavior on blocks
    engine.block.setPlaceholderEnabled(headerText, true);

    // Create an image placeholder
    const imageBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: 300, height: 200 } }
    );
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 120);
    engine.block.setName(imageBlock, 'product-image');
    engine.block.setPlaceholderEnabled(imageBlock, true);

    // Find all placeholder blocks in the scene
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Found placeholders:', placeholders.length);

    // Check if a block supports placeholder behavior
    const supportsPlaceholder =
      engine.block.supportsPlaceholderBehavior(imageBlock);
    console.log('Supports placeholder behavior:', supportsPlaceholder);

    // Check if placeholder is enabled
    const isPlaceholderEnabled = engine.block.isPlaceholderEnabled(imageBlock);
    console.log('Placeholder enabled:', isPlaceholderEnabled);

    // Set text variables to replace {{variableName}} placeholders
    engine.variable.setString('userName', 'Alex');

    // The text block now displays "Welcome, Alex!"
    console.log('Variable set, text updated automatically');

    // List all variables in the scene
    const allVariables = engine.variable.findAll();
    console.log('All variables:', allVariables);

    // Get a variable value
    const userName = engine.variable.getString('userName');
    console.log('Current userName:', userName);

    // Update the variable
    engine.variable.setString('userName', 'Jordan');

    // Replace image content by updating the fill's image URI
    const [productImage] = engine.block.findByName('product-image');
    const fill = engine.block.getFill(productImage);
    engine.block.setString(
      fill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    console.log('Image replaced');

    // Create another text block for direct replacement
    const subtitleText = engine.block.create('text');
    engine.block.setName(subtitleText, 'subtitle');
    engine.block.replaceText(subtitleText, 'Original subtitle text');
    engine.block.setTextFontSize(subtitleText, 48);
    engine.block.setWidthMode(subtitleText, 'Auto');
    engine.block.setHeightMode(subtitleText, 'Auto');
    engine.block.appendChild(page, subtitleText);
    engine.block.setPositionX(subtitleText, 50);
    engine.block.setPositionY(subtitleText, 350);

    // Replace text directly without using variables
    const [subtitle] = engine.block.findByName('subtitle');
    engine.block.replaceText(subtitle, 'Updated subtitle content');
    console.log('Text replaced directly');

    // Demonstrate data-driven template workflow pattern
    const dataRecords = [
      { name: 'Alice', title: 'Designer' },
      { name: 'Bob', title: 'Developer' }
    ];

    // Process each record (in practice, you'd export between iterations)
    for (const record of dataRecords) {
      engine.variable.setString('userName', record.name);
      console.log(`Processed record for: ${record.name}`);
      // In a real workflow, you would export here:
      // const blob = await engine.block.export(page, { mimeType: 'image/png' });
    }

    // Select the header text to show in the UI
    engine.block.select(headerText);

    console.log(
      'Replace content guide initialized. The template demonstrates text variables, image replacement, and placeholder APIs.'
    );
  }
}

export default Example;
