import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Multi-Page Layouts Guide
 *
 * This example demonstrates:
 * - Creating scenes with multiple pages
 * - Adding and configuring pages
 * - Scene layout types (HorizontalStack)
 * - Stack spacing between pages
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

    const engine = cesdk.engine;

    // Create a scene with HorizontalStack layout
    engine.scene.create('HorizontalStack');

    // Get the stack container
    const [stack] = engine.block.findByType('stack');

    // Add spacing between pages (20 pixels in screen space)
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Create the first page
    const firstPage = engine.block.create('page');
    engine.block.setWidth(firstPage, 800);
    engine.block.setHeight(firstPage, 600);
    engine.block.appendChild(stack, firstPage);

    // Add content to the first page
    const imageBlock1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: 300, height: 200 } }
    );
    engine.block.setPositionX(imageBlock1, 250);
    engine.block.setPositionY(imageBlock1, 200);
    engine.block.appendChild(firstPage, imageBlock1);

    // Create a second page with different content
    const secondPage = engine.block.create('page');
    engine.block.setWidth(secondPage, 800);
    engine.block.setHeight(secondPage, 600);
    engine.block.appendChild(stack, secondPage);

    // Add a different image to the second page
    const imageBlock2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      { size: { width: 300, height: 200 } }
    );
    engine.block.setPositionX(imageBlock2, 250);
    engine.block.setPositionY(imageBlock2, 200);
    engine.block.appendChild(secondPage, imageBlock2);

    engine.block.select(firstPage);
    engine.scene.enableZoomAutoFit(firstPage, 'Both');
  }
}

export default Example;
