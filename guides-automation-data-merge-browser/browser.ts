import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Data Merge Guide
 *
 * Demonstrates merging external data into templates:
 * - Setting text variables with engine.variable.setString()
 * - Finding variables with engine.variable.findAll()
 * - Finding blocks by name with engine.block.findByName()
 * - Updating image content in placeholder blocks
 * - Exporting personalized designs
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

    // Set page dimensions for a business card layout
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 400);

    // Sample data to merge into the template
    const sampleData = {
      name: 'Alex Smith',
      title: 'Creative Developer',
      email: 'alex.smith@example.com',
      photoUrl: 'https://img.ly/static/ubq_samples/sample_1.jpg'
    };

    // Create a profile photo block with a semantic name
    const photoBlock = engine.block.create('graphic');
    engine.block.setShape(photoBlock, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(
      photoFill,
      'fill/image/imageFileURI',
      sampleData.photoUrl
    );
    engine.block.setFill(photoBlock, photoFill);
    engine.block.setWidth(photoBlock, 150);
    engine.block.setHeight(photoBlock, 150);
    engine.block.setPositionX(photoBlock, 50);
    engine.block.setPositionY(photoBlock, 125);
    engine.block.setName(photoBlock, 'profile-photo');
    engine.block.appendChild(page, photoBlock);

    // Create a text block with variable placeholders
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

    // Set the variable values from data
    engine.variable.setString('name', sampleData.name);
    engine.variable.setString('title', sampleData.title);
    engine.variable.setString('email', sampleData.email);

    // Discover all variables in the scene
    const variables = engine.variable.findAll();
    console.log('Variables in scene:', variables);

    // Check if the text block references any variables
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    console.log('Text block has variables:', hasVariables);

    // Find blocks by their semantic name
    const [foundPhotoBlock] = engine.block.findByName('profile-photo');
    if (foundPhotoBlock) {
      console.log('Found profile-photo block:', foundPhotoBlock);

      // Update the image content
      const fill = engine.block.getFill(foundPhotoBlock);
      engine.block.setString(
        fill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_2.jpg'
      );
    }

    // Export the personalized design
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    console.log('Exported PNG blob:', blob.size, 'bytes');

    // Create a download link for the exported image
    const url = URL.createObjectURL(blob);
    console.log('Download URL created:', url);

    // Select the text block to show the variable values
    engine.block.select(textBlock);

    console.log(
      'Data merge guide initialized. Try changing variable values in the console.'
    );
  }
}

export default Example;
