import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Group and Ungroup Objects
 *
 * Demonstrates:
 * - Creating multiple graphic blocks
 * - Checking if blocks can be grouped
 * - Grouping blocks together
 * - Finding and inspecting groups
 * - Ungrouping blocks
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];
  const scene = engine.scene.get()!;
  engine.block.setFloat(scene, 'scene/dpi', 300);

  // Create a graphic block with a colored rectangle shape
  const block1 = engine.block.create('graphic');
  const shape1 = engine.block.createShape('rect');
  engine.block.setShape(block1, shape1);
  engine.block.setWidth(block1, 120);
  engine.block.setHeight(block1, 120);
  engine.block.setPositionX(block1, 200);
  engine.block.setPositionY(block1, 240);
  const fill1 = engine.block.createFill('color');
  engine.block.setColor(fill1, 'fill/color/value', {
    r: 0.4,
    g: 0.6,
    b: 0.9,
    a: 1.0,
  });
  engine.block.setFill(block1, fill1);
  engine.block.appendChild(page, block1);

  // Create two more blocks for grouping
  const block2 = engine.block.create('graphic');
  const shape2 = engine.block.createShape('rect');
  engine.block.setShape(block2, shape2);
  engine.block.setWidth(block2, 120);
  engine.block.setHeight(block2, 120);
  engine.block.setPositionX(block2, 340);
  engine.block.setPositionY(block2, 240);
  const fill2 = engine.block.createFill('color');
  engine.block.setColor(fill2, 'fill/color/value', {
    r: 0.9,
    g: 0.5,
    b: 0.4,
    a: 1.0,
  });
  engine.block.setFill(block2, fill2);
  engine.block.appendChild(page, block2);

  const block3 = engine.block.create('graphic');
  const shape3 = engine.block.createShape('rect');
  engine.block.setShape(block3, shape3);
  engine.block.setWidth(block3, 120);
  engine.block.setHeight(block3, 120);
  engine.block.setPositionX(block3, 480);
  engine.block.setPositionY(block3, 240);
  const fill3 = engine.block.createFill('color');
  engine.block.setColor(fill3, 'fill/color/value', {
    r: 0.5,
    g: 0.8,
    b: 0.5,
    a: 1.0,
  });
  engine.block.setFill(block3, fill3);
  engine.block.appendChild(page, block3);

  // Check if the blocks can be grouped together
  const canGroup = engine.block.isGroupable([block1, block2, block3]);
  // eslint-disable-next-line no-console
  console.log('Blocks can be grouped:', canGroup);

  // Group the blocks together
  let groupId: number | null = null;
  if (canGroup) {
    groupId = engine.block.group([block1, block2, block3]);
    // eslint-disable-next-line no-console
    console.log('Created group with ID:', groupId);

    // Find all groups in the scene
    const allGroups = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Number of groups in scene:', allGroups.length);

    // Check the type of the group block
    const groupType = engine.block.getType(groupId);
    // eslint-disable-next-line no-console
    console.log('Group block type:', groupType);

    // Get the members of the group
    const members = engine.block.getChildren(groupId);
    // eslint-disable-next-line no-console
    console.log('Group has', members.length, 'members');

    // Ungroup the blocks to make them independent again
    engine.block.ungroup(groupId);
    // eslint-disable-next-line no-console
    console.log('Ungrouped blocks');

    // Verify blocks are no longer in a group
    const groupsAfterUngroup = engine.block.findByType('group');
    // eslint-disable-next-line no-console
    console.log('Groups after ungrouping:', groupsAfterUngroup.length);

    // Re-group for the final export
    groupId = engine.block.group([block1, block2, block3]);
  }

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/grouping-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('Exported result to output/grouping-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
