import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Design Units Guide
 *
 * Demonstrates working with design units in CE.SDK:
 * - Understanding unit types (Pixel, Millimeter, Inch)
 * - Getting and setting the design unit
 * - Configuring DPI for print output
 * - Setting up print-ready dimensions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 210, height: 297, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the current scene
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    // Get the current design unit
    const currentUnit = engine.scene.getDesignUnit();
    // eslint-disable-next-line no-console
    console.log('Current design unit:', currentUnit); // 'Pixel' by default

    // Set design unit to Millimeter for print workflow
    engine.scene.setDesignUnit('Millimeter');

    // Verify the change
    const newUnit = engine.scene.getDesignUnit();
    // eslint-disable-next-line no-console
    console.log('Design unit changed to:', newUnit); // 'Millimeter'

    // Set DPI to 300 for print-quality exports
    // Higher DPI produces higher resolution output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Verify the DPI setting
    const dpi = engine.block.getFloat(scene, 'scene/dpi');
    // eslint-disable-next-line no-console
    console.log('DPI set to:', dpi); // 300

    // Get the page and set A4 dimensions (210 x 297 mm)
    const page = engine.block.findByType('page')[0];

    // Verify dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    // eslint-disable-next-line no-console
    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);

    // Create a text block with millimeter dimensions
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position text at 20mm from left, 30mm from top
    engine.block.setPositionX(textBlock, 20);
    engine.block.setPositionY(textBlock, 30);

    // Set text block size to 170mm x 50mm
    engine.block.setWidth(textBlock, 170);
    engine.block.setHeight(textBlock, 50);

    // Add content to the text block
    engine.block.setString(
      textBlock,
      'text/text',
      'This A4 document uses millimeter units with 300 DPI for print-ready output.'
    );

    // Demonstrate unit comparison
    // At 300 DPI: 1 inch = 300 pixels, 1 mm = ~11.81 pixels
    // eslint-disable-next-line no-console
    console.log('Unit comparison at 300 DPI:');
    // eslint-disable-next-line no-console
    console.log(
      '- A4 width (210mm) will export as',
      210 * (300 / 25.4),
      'pixels'
    );
    // eslint-disable-next-line no-console
    console.log(
      '- A4 height (297mm) will export as',
      297 * (300 / 25.4),
      'pixels'
    );

    // eslint-disable-next-line no-console
    console.log(
      'Design units guide initialized. Scene configured for A4 print output.'
    );
  }
}

export default Example;
