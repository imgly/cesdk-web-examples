import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Use Templates Programmatically
 *
 * This example demonstrates how to work with templates programmatically:
 * 1. Creating templates from scratch with text variables
 * 2. Setting up text variables for dynamic content
 * 3. Populating templates with data
 * 4. Saving and exporting templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions for the template
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Create a greeting card template from scratch
    // This template will have placeholders for customization

    // Set up text variables FIRST so they're available when text is created
    engine.variable.setString('recipientName', 'Alice');
    engine.variable.setString('customMessage', 'Wishing you a wonderful day!');

    // Add a title text block with variable placeholder
    const titleBlock = engine.block.create('text');
    engine.block.setName(titleBlock, 'title');
    engine.block.appendChild(page, titleBlock);
    engine.block.setPositionX(titleBlock, 50);
    engine.block.setPositionY(titleBlock, 50);
    engine.block.setWidth(titleBlock, 700);
    engine.block.setHeight(titleBlock, 80);

    // Set text with variable syntax for dynamic replacement
    engine.block.replaceText(titleBlock, 'Hello, {{recipientName}}!');
    engine.block.setTextColor(titleBlock, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Set font size and weight for better visibility
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);

    // Add a message text block with variable
    const messageBlock = engine.block.create('text');
    engine.block.setName(messageBlock, 'message');
    engine.block.appendChild(page, messageBlock);
    engine.block.setPositionX(messageBlock, 50);
    engine.block.setPositionY(messageBlock, 140);
    engine.block.setWidth(messageBlock, 700);
    engine.block.setHeight(messageBlock, 120);

    engine.block.replaceText(messageBlock, '{{customMessage}}');
    engine.block.setTextColor(messageBlock, {
      r: 0.3,
      g: 0.3,
      b: 0.3,
      a: 1.0
    });

    engine.block.setFloat(messageBlock, 'text/fontSize', 28);

    // Variables have already been set earlier in the template creation
    // You can retrieve variable values at any time
    const recipientName = engine.variable.getString('recipientName');
    console.log('Current recipient:', recipientName);

    // List all variables in the scene
    const allVariables = engine.variable.findAll();
    console.log('All variables:', allVariables);

    // Demonstrate populating the template with different data
    // In a real application, you would iterate through data records

    // Example: Update variables to populate template with new data
    setTimeout(() => {
      engine.variable.setString('recipientName', 'Bob');
      engine.variable.setString(
        'customMessage',
        'Congratulations on your achievement!'
      );
      console.log('Variables updated to new values');
    }, 2000);

    // Demonstrate saving and exporting the template
    setTimeout(async () => {
      // Save the entire scene to a string for later reuse
      const sceneString = await engine.scene.saveToString();
      console.log('Template saved, length:', sceneString.length);

      // You can export the current view as an image
      const blob = await engine.block.export(page, 'image/png', {
        targetWidth: 800,
        targetHeight: 600
      });
      console.log('Exported as PNG, size:', blob.size, 'bytes');

      // Create a download link for the export (demonstration purposes)
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'greeting-card.png';
      console.log('Export ready for download');
      // Uncomment to trigger automatic download:
      // link.click();
    }, 4000);

    // Switch to adopter mode to demonstrate placeholder functionality
    engine.editor.setRole('Adopter');

    console.log('Template created successfully!');
    console.log('The template includes:');
    console.log('- Text variables: recipientName, customMessage');
    console.log('- Automatic variable updates will occur every 2 seconds');
  }
}

export default Example;
