import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Scenes Guide
 *
 * Demonstrates the complete scene lifecycle in CE.SDK:
 * - Creating scenes with different layouts
 * - Managing pages within scenes
 * - Configuring scene properties
 * - Saving and loading scenes
 * - Camera control and zoom
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and default assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Create a new design scene with VerticalStack layout
    // The layout controls how pages are arranged in the canvas
    engine.scene.create('VerticalStack');

    // Get the stack container and add spacing between pages
    const stack = engine.block.findByType('stack')[0];
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Create the first page
    const page1 = engine.block.create('page');
    engine.block.setWidth(page1, 800);
    engine.block.setHeight(page1, 600);
    engine.block.appendChild(stack, page1);

    // Create a second page
    const page2 = engine.block.create('page');
    engine.block.setWidth(page2, 800);
    engine.block.setHeight(page2, 600);
    engine.block.appendChild(stack, page2);

    // Add a shape to the first page
    const graphic1 = engine.block.create('graphic');
    engine.block.setShape(graphic1, engine.block.createShape('rect'));
    const fill1 = engine.block.createFill('color');
    engine.block.setColor(fill1, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setFill(graphic1, fill1);
    engine.block.setWidth(graphic1, 400);
    engine.block.setHeight(graphic1, 300);
    engine.block.setPositionX(graphic1, 200);
    engine.block.setPositionY(graphic1, 150);
    engine.block.appendChild(page1, graphic1);

    // Add a different shape to the second page
    const graphic2 = engine.block.create('graphic');
    engine.block.setShape(graphic2, engine.block.createShape('ellipse'));
    const fill2 = engine.block.createFill('color');
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 0.9,
      g: 0.3,
      b: 0.2,
      a: 1
    });
    engine.block.setFill(graphic2, fill2);
    engine.block.setWidth(graphic2, 350);
    engine.block.setHeight(graphic2, 350);
    engine.block.setPositionX(graphic2, 225);
    engine.block.setPositionY(graphic2, 125);
    engine.block.appendChild(page2, graphic2);

    // Query scene properties
    const currentUnit = engine.scene.getDesignUnit();
    // eslint-disable-next-line no-console
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    // eslint-disable-next-line no-console
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    // eslint-disable-next-line no-console
    console.log('Scene mode:', mode);

    // Access pages within the scene
    const pages = engine.scene.getPages();
    // eslint-disable-next-line no-console
    console.log('Number of pages:', pages.length);

    // Get the current page (nearest to viewport center)
    const currentPage = engine.scene.getCurrentPage();
    // eslint-disable-next-line no-console
    console.log('Current page ID:', currentPage);

    // Zoom to show all pages in the scene
    const scene = engine.scene.get();
    if (scene) {
      await engine.scene.zoomToBlock(scene, { padding: 50 });
    }

    // Get the current zoom level
    const zoomLevel = engine.scene.getZoomLevel();
    // eslint-disable-next-line no-console
    console.log('Current zoom level:', zoomLevel);

    // Save the scene to a string for persistence
    const sceneString = await engine.scene.saveToString();
    // eslint-disable-next-line no-console
    console.log('Scene saved successfully. String length:', sceneString.length);

    // Demonstrate loading the scene from the saved string
    // This replaces the current scene with the saved version
    await engine.scene.loadFromString(sceneString);
    // eslint-disable-next-line no-console
    console.log('Scene loaded from saved string');

    // Zoom to show all loaded pages
    const loadedScene = engine.scene.get();
    if (loadedScene) {
      await engine.scene.zoomToBlock(loadedScene, { padding: 50 });
    }

    // eslint-disable-next-line no-console
    console.log('Scenes guide initialized successfully.');
  }
}

export default Example;
