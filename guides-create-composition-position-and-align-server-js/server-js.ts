import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Positioning and Alignment
 *
 * Demonstrates positioning, aligning, and distributing design elements:
 * - Setting block positions with absolute and percentage modes
 * - Aligning multiple blocks horizontally and vertically
 * - Aligning a single block within its parent
 * - Distributing blocks with even spacing
 * - Exporting results
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: 150, height: 100 };

  // Create an image block and position it using absolute coordinates
  const block1 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block1);

  // Set position using absolute coordinates (in design units)
  engine.block.setPositionX(block1, 50);
  engine.block.setPositionY(block1, 50);

  // Query the current position
  const x1 = engine.block.getPositionX(block1);
  const y1 = engine.block.getPositionY(block1);
  console.log(`Block 1 absolute position: (${x1}, ${y1})`);

  // Create another block and position it using percentage mode
  const block2 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block2);

  // Set position mode to Percent and use percentage values
  engine.block.setPositionXMode(block2, 'Percent');
  engine.block.setPositionYMode(block2, 'Percent');
  engine.block.setPositionX(block2, 0.5); // 50% from left
  engine.block.setPositionY(block2, 0.1); // 10% from top

  // Query the position mode
  const xMode = engine.block.getPositionXMode(block2);
  const yMode = engine.block.getPositionYMode(block2);
  console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);

  // Create a third block and use the convenience method
  const block3 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block3);

  // Set both X and Y at once with a specific position mode
  engine.block.setPosition(block3, 0.75, 0.1, { positionMode: 'Percent' });
  console.log(
    'Block 3 set to 75% horizontal, 10% vertical using setPosition()'
  );

  // ===== ALIGNMENT DEMONSTRATION =====
  console.log('\n--- Alignment Demo ---');

  // Create multiple blocks for alignment demonstration
  const alignBlocks: number[] = [];
  const alignPositions = [
    { x: 100, y: 200 },
    { x: 250, y: 250 },
    { x: 180, y: 300 },
    { x: 350, y: 275 }
  ];

  for (const pos of alignPositions) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 100, height: 80 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
    alignBlocks.push(block);
  }

  // Check if blocks can be aligned
  const canAlign = engine.block.isAlignable(alignBlocks);
  console.log('Can align blocks:', canAlign);

  if (canAlign) {
    // Align blocks horizontally to the left edge of their bounding box
    engine.block.alignHorizontally(alignBlocks, 'Left');
    console.log('Blocks aligned to left edge');
  }

  // Create a single block to demonstrate aligning within parent
  const singleBlock = await engine.block.addImage(imageUri, {
    size: { width: 120, height: 80 }
  });
  engine.block.appendChild(page, singleBlock);

  // Position initially off-center
  engine.block.setPositionX(singleBlock, 500);
  engine.block.setPositionY(singleBlock, 450);

  // Align single block to center of parent (page)
  if (engine.block.isAlignable([singleBlock])) {
    engine.block.alignHorizontally([singleBlock], 'Center');
    engine.block.alignVertically([singleBlock], 'Bottom');
    console.log('Single block centered horizontally and aligned to bottom');
  }

  // ===== DISTRIBUTION DEMONSTRATION =====
  console.log('\n--- Distribution Demo ---');

  // Create blocks for distribution demonstration
  const distributeBlocks: number[] = [];
  const xPositions = [480, 530, 650, 750];

  for (let i = 0; i < xPositions.length; i++) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 60, height: 50 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, xPositions[i]);
    engine.block.setPositionY(block, 200); // Same Y for horizontal distribution
    distributeBlocks.push(block);
  }

  // Check if blocks can be distributed
  const canDistribute = engine.block.isDistributable(distributeBlocks);
  console.log('Can distribute blocks:', canDistribute);

  if (canDistribute) {
    // Distribute blocks horizontally with even spacing
    engine.block.distributeHorizontally(distributeBlocks);
    console.log('Blocks distributed horizontally with even spacing');
  }

  // Create another set of blocks for vertical distribution
  const verticalBlocks: number[] = [];
  const yPositions = [280, 350, 420, 520];

  for (let i = 0; i < yPositions.length; i++) {
    const block = await engine.block.addImage(imageUri, {
      size: { width: 60, height: 50 }
    });
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, 700);
    engine.block.setPositionY(block, yPositions[i]);
    verticalBlocks.push(block);
  }

  if (engine.block.isDistributable(verticalBlocks)) {
    engine.block.distributeVertically(verticalBlocks);
    console.log('Vertical blocks distributed with even spacing');
  }

  // ===== SUMMARY =====
  console.log('\n--- Summary ---');
  const allGraphics = engine.block.findByType('graphic');
  console.log(`Total blocks created: ${allGraphics.length}`);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/position-and-align.png', buffer);
  console.log('\nExported to output/position-and-align.png');
} finally {
  engine.dispose();
}
