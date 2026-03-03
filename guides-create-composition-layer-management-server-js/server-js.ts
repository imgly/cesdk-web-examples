import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Layer Management
 *
 * Demonstrates programmatic layer management:
 * - Navigating parent-child hierarchy
 * - Adding and positioning blocks in the layer stack
 * - Changing z-order (bring to front, send to back)
 * - Controlling visibility
 * - Duplicating and removing blocks
 * - Exporting the result
 */

const engine = await CreativeEngine.init({});

try {
  // Create a scene with a page
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0]!;

  // Create a colored rectangle
  const redRect = engine.block.create('graphic');
  engine.block.setShape(redRect, engine.block.createShape('rect'));
  const redFill = engine.block.createFill('color');
  engine.block.setFill(redRect, redFill);
  engine.block.setColor(redFill, 'fill/color/value', {
    r: 0.9,
    g: 0.2,
    b: 0.2,
    a: 1
  });
  engine.block.setWidth(redRect, 180);
  engine.block.setHeight(redRect, 180);
  engine.block.setPositionX(redRect, 220);
  engine.block.setPositionY(redRect, 120);

  // Create additional rectangles to demonstrate layer ordering
  const greenRect = engine.block.create('graphic');
  engine.block.setShape(greenRect, engine.block.createShape('rect'));
  const greenFill = engine.block.createFill('color');
  engine.block.setFill(greenRect, greenFill);
  engine.block.setColor(greenFill, 'fill/color/value', {
    r: 0.2,
    g: 0.8,
    b: 0.2,
    a: 1
  });
  engine.block.setWidth(greenRect, 180);
  engine.block.setHeight(greenRect, 180);
  engine.block.setPositionX(greenRect, 280);
  engine.block.setPositionY(greenRect, 180);

  const blueRect = engine.block.create('graphic');
  engine.block.setShape(blueRect, engine.block.createShape('rect'));
  const blueFill = engine.block.createFill('color');
  engine.block.setFill(blueRect, blueFill);
  engine.block.setColor(blueFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1
  });
  engine.block.setWidth(blueRect, 180);
  engine.block.setHeight(blueRect, 180);
  engine.block.setPositionX(blueRect, 340);
  engine.block.setPositionY(blueRect, 240);

  // Add blocks to the page - last appended is on top
  engine.block.appendChild(page, redRect);
  engine.block.appendChild(page, greenRect);
  engine.block.appendChild(page, blueRect);

  // Get the parent of a block
  const parent = engine.block.getParent(redRect);
  console.log('Parent of red rectangle:', parent);

  // Get all children of the page
  const children = engine.block.getChildren(page);
  console.log('Page children (in render order):', children);

  // Insert a new block at a specific position (index 0 = back)
  const yellowRect = engine.block.create('graphic');
  engine.block.setShape(yellowRect, engine.block.createShape('rect'));
  const yellowFill = engine.block.createFill('color');
  engine.block.setFill(yellowRect, yellowFill);
  engine.block.setColor(yellowFill, 'fill/color/value', {
    r: 0.95,
    g: 0.85,
    b: 0.2,
    a: 1
  });
  engine.block.setWidth(yellowRect, 180);
  engine.block.setHeight(yellowRect, 180);
  engine.block.setPositionX(yellowRect, 160);
  engine.block.setPositionY(yellowRect, 60);
  engine.block.insertChild(page, yellowRect, 0);

  // Bring the red rectangle to the front
  engine.block.bringToFront(redRect);
  console.log('Red rectangle brought to front');

  // Send the blue rectangle to the back
  engine.block.sendToBack(blueRect);
  console.log('Blue rectangle sent to back');

  // Move the green rectangle forward one layer
  engine.block.bringForward(greenRect);
  console.log('Green rectangle moved forward');

  // Move the yellow rectangle backward one layer
  engine.block.sendBackward(yellowRect);
  console.log('Yellow rectangle moved backward');

  // Check and toggle visibility
  const isVisible = engine.block.isVisible(blueRect);
  console.log('Blue rectangle visible:', isVisible);

  // Hide the blue rectangle temporarily
  engine.block.setVisible(blueRect, false);
  console.log('Blue rectangle hidden');

  // Show it again for the export
  engine.block.setVisible(blueRect, true);
  console.log('Blue rectangle shown again');

  // Duplicate a block
  const duplicateGreen = engine.block.duplicate(greenRect);
  engine.block.setPositionX(duplicateGreen, 400);
  engine.block.setPositionY(duplicateGreen, 300);
  console.log('Green rectangle duplicated');

  // Check if a block is valid before operations
  const isValidBefore = engine.block.isValid(yellowRect);
  console.log('Yellow rectangle valid before destroy:', isValidBefore);

  // Remove a block from the scene
  engine.block.destroy(yellowRect);
  console.log('Yellow rectangle destroyed');

  // Check validity after destruction
  const isValidAfter = engine.block.isValid(yellowRect);
  console.log('Yellow rectangle valid after destroy:', isValidAfter);

  // Log final layer order
  const finalChildren = engine.block.getChildren(page);
  console.log('Final page children:', finalChildren);

  // Export the page as an image
  mkdirSync('output', { recursive: true });
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync('output/layer-management-result.png', buffer);
  console.log('Exported: output/layer-management-result.png');

  console.log('\nLayer management example complete');
} finally {
  engine.dispose();
}
