import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Example: Scenes Guide
 *
 * Demonstrates the complete scene lifecycle in CE.SDK:
 * - Creating scenes with different layouts
 * - Managing pages within scenes
 * - Configuring scene properties
 * - Saving and loading scenes
 * - Exporting scenes to files
 */
async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
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
    console.log('Scene design unit:', currentUnit);

    // Get the scene layout
    const layout = engine.scene.getLayout();
    console.log('Scene layout:', layout);

    // Check scene mode (Design or Video)
    const mode = engine.scene.getMode();
    console.log('Scene mode:', mode);

    // Access pages within the scene
    const pages = engine.scene.getPages();
    console.log('Number of pages:', pages.length);

    // Save the scene to a string for persistence
    const sceneString = await engine.scene.saveToString();
    console.log('Scene saved successfully. String length:', sceneString.length);

    // Demonstrate loading the scene from the saved string
    // This replaces the current scene with the saved version
    await engine.scene.loadFromString(sceneString);
    console.log('Scene loaded from saved string');

    // Export the first page to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const loadedPages = engine.scene.getPages();
    const blob = await engine.block.export(loadedPages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/scenes-page1.png`, buffer);
    console.log('Exported to output/scenes-page1.png');

    console.log('Scenes guide completed successfully.');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
