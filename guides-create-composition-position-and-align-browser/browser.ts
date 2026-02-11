import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Positioning and Alignment Guide
 *
 * Demonstrates positioning, aligning, and distributing design elements:
 * - Setting block positions with absolute and percentage modes
 * - Aligning multiple blocks horizontally and vertically
 * - Aligning a single block within its parent
 * - Distributing blocks with even spacing
 * - Configuring snapping thresholds and guide colors
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  private currentDemo = 'position';

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
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Create navigation buttons for different demos
    this.addNavigationButtons(cesdk);

    // Run the initial demo
    await this.runPositionDemo(cesdk);
  }

  private addNavigationButtons(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    // Register position demo button component
    cesdk.ui.registerComponent('position-demo-btn', ({ builder }) => {
      builder.Button('position-demo', {
        label: 'Position',
        variant: 'regular',
        isActive: this.currentDemo === 'position',
        onClick: async () => {
          this.currentDemo = 'position';
          await this.clearAndRun(cesdk, () => this.runPositionDemo(cesdk));
        }
      });
    });

    // Register align demo button component
    cesdk.ui.registerComponent('align-demo-btn', ({ builder }) => {
      builder.Button('align-demo', {
        label: 'Align',
        variant: 'regular',
        isActive: this.currentDemo === 'align',
        onClick: async () => {
          this.currentDemo = 'align';
          await this.clearAndRun(cesdk, () => this.runAlignDemo(cesdk));
        }
      });
    });

    // Register distribute demo button component
    cesdk.ui.registerComponent('distribute-demo-btn', ({ builder }) => {
      builder.Button('distribute-demo', {
        label: 'Distribute',
        variant: 'regular',
        isActive: this.currentDemo === 'distribute',
        onClick: async () => {
          this.currentDemo = 'distribute';
          await this.clearAndRun(cesdk, () => this.runDistributeDemo(cesdk));
        }
      });
    });

    // Register snapping demo button component
    cesdk.ui.registerComponent('snapping-demo-btn', ({ builder }) => {
      builder.Button('snapping-demo', {
        label: 'Snapping',
        variant: 'regular',
        isActive: this.currentDemo === 'snapping',
        onClick: async () => {
          this.currentDemo = 'snapping';
          await this.clearAndRun(cesdk, () => this.runSnappingDemo(cesdk));
        }
      });
    });

    // Add buttons to navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'position-demo-btn'
    );
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'align-demo-btn'
    );
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'distribute-demo-btn'
    );
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'snapping-demo-btn'
    );
  }

  private async clearAndRun(
    cesdk: NonNullable<EditorPluginContext['cesdk']>,
    runDemo: () => Promise<void>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Remove all children from the page
    const children = engine.block.getChildren(page);
    children.forEach((child) => {
      engine.block.destroy(child);
    });

    // Run the new demo
    await runDemo();
  }

  private async runPositionDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create image blocks to demonstrate positioning
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 150, height: 100 };

    // Block 1: Absolute positioning at specific coordinates
    const block1 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block1);

    // Set position using absolute coordinates (in design units)
    engine.block.setPositionX(block1, 50);
    engine.block.setPositionY(block1, 50);

    // Query the current position
    const x1 = engine.block.getPositionX(block1);
    const y1 = engine.block.getPositionY(block1);
    // eslint-disable-next-line no-console
    console.log(`Block 1 position: (${x1}, ${y1})`);

    // Block 2: Percentage-based positioning (relative to parent)
    const block2 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block2);

    // Set position mode to Percent and use percentage values
    engine.block.setPositionXMode(block2, 'Percent');
    engine.block.setPositionYMode(block2, 'Percent');
    engine.block.setPositionX(block2, 0.5); // 50% from left
    engine.block.setPositionY(block2, 0.5); // 50% from top

    // Query the position mode
    const xMode = engine.block.getPositionXMode(block2);
    const yMode = engine.block.getPositionYMode(block2);
    // eslint-disable-next-line no-console
    console.log(`Block 2 position modes: X=${xMode}, Y=${yMode}`);

    // Block 3: Using the convenience method setPosition()
    const block3 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block3);

    // Set both X and Y at once with a specific position mode
    engine.block.setPosition(block3, 0.75, 0.25, { positionMode: 'Percent' });

    // eslint-disable-next-line no-console
    console.log(
      `Block 3 set to 75% horizontal, 25% vertical using setPosition()`
    );

    // Block 4: Bottom right corner using absolute positioning
    const block4 = await engine.block.addImage(imageUri, { size: blockSize });
    engine.block.appendChild(page, block4);
    engine.block.setPositionX(block4, pageWidth - blockSize.width - 50);
    engine.block.setPositionY(block4, pageHeight - blockSize.height - 50);

    // eslint-disable-next-line no-console
    console.log(
      'Position demo initialized. Blocks placed at various positions.'
    );
  }

  private async runAlignDemo(cesdk: NonNullable<EditorPluginContext['cesdk']>) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create multiple blocks for alignment demonstration
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 100, height: 80 };

    // Create 4 blocks at random-ish positions
    const blocks: number[] = [];
    const positions = [
      { x: 100, y: 100 },
      { x: 250, y: 150 },
      { x: 180, y: 250 },
      { x: 350, y: 200 }
    ];

    for (const pos of positions) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
      blocks.push(block);
    }

    // Check if blocks can be aligned
    const canAlign = engine.block.isAlignable(blocks);
    // eslint-disable-next-line no-console
    console.log('Can align blocks:', canAlign);

    if (canAlign) {
      // Align blocks horizontally to the left edge of their bounding box
      engine.block.alignHorizontally(blocks, 'Left');
      // eslint-disable-next-line no-console
      console.log('Blocks aligned to left edge');
    }

    // Create a single block to demonstrate aligning within parent
    const singleBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, singleBlock);

    // Position initially off-center
    engine.block.setPositionX(singleBlock, 500);
    engine.block.setPositionY(singleBlock, 300);

    // Align single block to center of parent (page)
    if (engine.block.isAlignable([singleBlock])) {
      engine.block.alignHorizontally([singleBlock], 'Center');
      engine.block.alignVertically([singleBlock], 'Center');
      // eslint-disable-next-line no-console
      console.log('Single block centered within parent');
    }

    // eslint-disable-next-line no-console
    console.log(
      'Align demo initialized. Left group aligned left, single block centered.'
    );
  }

  private async runDistributeDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create multiple blocks for distribution demonstration
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: 100, height: 80 };

    // Create 4 blocks at uneven horizontal positions
    const blocks: number[] = [];
    const xPositions = [50, 180, 400, 650];

    for (let i = 0; i < xPositions.length; i++) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, xPositions[i]);
      engine.block.setPositionY(block, 200); // Same Y for horizontal distribution
      blocks.push(block);
    }

    // Check if blocks can be distributed
    const canDistribute = engine.block.isDistributable(blocks);
    // eslint-disable-next-line no-console
    console.log('Can distribute blocks:', canDistribute);

    if (canDistribute) {
      // Distribute blocks horizontally with even spacing
      engine.block.distributeHorizontally(blocks);
      // eslint-disable-next-line no-console
      console.log('Blocks distributed horizontally with even spacing');
    }

    // Create another set of blocks for vertical distribution
    const verticalBlocks: number[] = [];
    const yPositions = [50, 150, 350, 500];

    for (let i = 0; i < yPositions.length; i++) {
      const block = await engine.block.addImage(imageUri, { size: blockSize });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, 600); // Same X for vertical distribution
      engine.block.setPositionY(block, yPositions[i]);
      verticalBlocks.push(block);
    }

    if (engine.block.isDistributable(verticalBlocks)) {
      engine.block.distributeVertically(verticalBlocks);
      // eslint-disable-next-line no-console
      console.log('Vertical blocks distributed with even spacing');
    }

    // eslint-disable-next-line no-console
    console.log(
      'Distribute demo initialized. Left group horizontal, right group vertical.'
    );
  }

  private async runSnappingDemo(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ) {
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create some blocks to demonstrate snapping
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create reference blocks (these will act as snap targets)
    const refBlock1 = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, refBlock1);
    engine.block.setPositionX(refBlock1, 100);
    engine.block.setPositionY(refBlock1, 100);

    const refBlock2 = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, refBlock2);
    engine.block.setPositionX(refBlock2, 100);
    engine.block.setPositionY(refBlock2, 350);

    // Create a draggable block
    const dragBlock = await engine.block.addImage(imageUri, {
      size: { width: 120, height: 80 }
    });
    engine.block.appendChild(page, dragBlock);
    engine.block.setPositionX(dragBlock, 400);
    engine.block.setPositionY(dragBlock, 225);

    // Configure position snapping threshold (pixels)
    // Higher values = snapping activates from further away
    engine.editor.setSettingFloat('positionSnappingThreshold', 10);

    // Configure rotation snapping threshold (degrees)
    engine.editor.setSettingFloat('rotationSnappingThreshold', 5);
    // eslint-disable-next-line no-console
    console.log('Snapping thresholds configured: position=10px, rotation=5deg');

    // Customize snapping guide colors
    engine.editor.setSettingColor('snappingGuideColor', {
      r: 0.2,
      g: 0.6,
      b: 1.0,
      a: 1.0
    });

    engine.editor.setSettingColor('rotationSnappingGuideColor', {
      r: 1.0,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });

    engine.editor.setSettingColor('ruleOfThirdsLineColor', {
      r: 0.5,
      g: 0.5,
      b: 0.5,
      a: 0.5
    });
    // eslint-disable-next-line no-console
    console.log('Snapping guide colors configured');

    // Select the draggable block so user can interact with it
    engine.block.setSelected(dragBlock, true);

    // eslint-disable-next-line no-console
    console.log(
      'Snapping demo initialized. Drag the selected block to see snapping guides.'
    );
  }
}

export default Example;
