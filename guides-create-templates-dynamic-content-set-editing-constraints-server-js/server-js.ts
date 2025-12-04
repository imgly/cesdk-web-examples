import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Set Editing Constraints
 *
 * Demonstrates how to use CE.SDK's Scope system to control editing capabilities:
 * - Setting global scopes to respect block-level settings
 * - Disabling move scope to lock position
 * - Disabling lifecycle scopes to prevent deletion
 * - Checking scope states
 * - Saving constrained scenes
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  // Set page background color
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0,
  });

  // Set global scopes to 'Defer' to respect block-level scope settings
  // Without this, global 'Allow' settings might override block-level restrictions
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('layer/resize', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');

  // Global scope modes:
  // - 'Allow': Always allow (overrides block-level settings)
  // - 'Deny': Always deny (overrides block-level settings)
  // - 'Defer': Use block-level settings (respects setScopeEnabled)

  // Calculate layout for 4 examples (2x2 grid)
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const margin = 40;
  const spacing = 20;
  const blockWidth = (pageWidth - margin * 2 - spacing) / 2;
  const blockHeight = (pageHeight - margin * 2 - spacing) / 2;

  const getPosition = (index: number) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      x: margin + col * (blockWidth + spacing),
      y: margin + row * (blockHeight + spacing),
    };
  };

  // Helper function to create a labeled example block
  const createExampleBlock = (
    labelText: string,
    backgroundColor: { r: number; g: number; b: number },
    applyScopesCallback?: (blockId: number) => void
  ): number => {
    // Create container block
    const block = engine.block.create('graphic');
    const shape = engine.block.createShape('rect');
    engine.block.setShape(block, shape);
    engine.block.setWidth(block, blockWidth);
    engine.block.setHeight(block, blockHeight);

    // Set background color
    const fill = engine.block.createFill('color');
    engine.block.setFill(block, fill);
    engine.block.setColor(fill, 'fill/color/value', {
      ...backgroundColor,
      a: 1.0,
    });

    // Add label text
    const textBlock = engine.block.create('text');
    engine.block.setWidth(textBlock, blockWidth * 0.85);
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setString(textBlock, 'text/text', labelText);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(textBlock, 'text/fontSize', 16);

    // Append text to get dimensions
    engine.block.appendChild(block, textBlock);

    // Center text in container
    const textWidth = engine.block.getWidth(textBlock);
    const textHeight = engine.block.getHeight(textBlock);
    engine.block.setPositionX(textBlock, (blockWidth - textWidth) / 2);
    engine.block.setPositionY(textBlock, (blockHeight - textHeight) / 2);

    // Set text color to white
    const textFill = engine.block.createFill('color');
    engine.block.setFill(textBlock, textFill);
    engine.block.setColor(textFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0,
    });

    // Apply scope configuration to both blocks
    if (applyScopesCallback) {
      applyScopesCallback(block);
      applyScopesCallback(textBlock);
    }

    // Append container to page
    engine.block.appendChild(page, block);

    return block;
  };

  // ===== Example 1: All Scopes Enabled =====
  const enableAllScopes = (block: number) => {
    // Explicitly enable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);

    // Explicitly enable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', true);
    engine.block.setScopeEnabled(block, 'fill/changeType', true);

    // Explicitly enable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', true);
    engine.block.setScopeEnabled(block, 'text/character', true);
  };

  const fullyEditableBlock = createExampleBlock(
    'Fully\neditable',
    {
      r: 0.5,
      g: 0.85,
      b: 0.5,
    },
    enableAllScopes
  );
  // All scopes are explicitly enabled - users have full editing capabilities
  // This is the default behavior, but explicitly enabling shows clear intent

  // ===== Example 2: Lock Position (Disable Move Scope) =====
  const disableMoveScope = (block: number) => {
    // Disable move scope
    engine.block.setScopeEnabled(block, 'layer/move', false);

    // Explicitly enable other transform scopes
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);

    // Explicitly enable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', true);
  };

  const moveLockedBlock = createExampleBlock(
    'Locked\nposition',
    {
      r: 0.5,
      g: 0.75,
      b: 0.9,
    },
    disableMoveScope
  );
  // Block position is locked - users cannot move or reposition it
  // Other scopes are explicitly enabled: resizing, rotation, flipping, deletion, duplication

  // ===== Example 3: Prevent Deletion (Disable Lifecycle Scopes) =====
  const disableLifecycleScopes = (block: number) => {
    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Explicitly enable transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', true);
    engine.block.setScopeEnabled(block, 'layer/resize', true);
    engine.block.setScopeEnabled(block, 'layer/rotate', true);
    engine.block.setScopeEnabled(block, 'layer/flip', true);
  };

  const lifecycleLockedBlock = createExampleBlock(
    'Cannot\ndelete',
    {
      r: 0.75,
      g: 0.75,
      b: 0.75,
    },
    disableLifecycleScopes
  );
  // Block cannot be deleted or duplicated
  // Other scopes are explicitly enabled: moving, resizing, rotation, flipping

  // ===== Example 4: All Scopes Disabled =====
  const disableAllScopes = (block: number) => {
    // Disable all transform scopes
    engine.block.setScopeEnabled(block, 'layer/move', false);
    engine.block.setScopeEnabled(block, 'layer/resize', false);
    engine.block.setScopeEnabled(block, 'layer/rotate', false);
    engine.block.setScopeEnabled(block, 'layer/flip', false);
    engine.block.setScopeEnabled(block, 'layer/crop', false);

    // Disable lifecycle scopes
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(block, 'lifecycle/duplicate', false);

    // Disable fill scopes
    engine.block.setScopeEnabled(block, 'fill/change', false);
    engine.block.setScopeEnabled(block, 'fill/changeType', false);
    engine.block.setScopeEnabled(block, 'stroke/change', false);

    // Disable text scopes
    engine.block.setScopeEnabled(block, 'text/edit', false);
    engine.block.setScopeEnabled(block, 'text/character', false);

    // Disable shape scopes
    engine.block.setScopeEnabled(block, 'shape/change', false);

    // Disable editor scopes
    engine.block.setScopeEnabled(block, 'editor/select', false);

    // Disable appearance scopes
    engine.block.setScopeEnabled(block, 'layer/opacity', false);
    engine.block.setScopeEnabled(block, 'layer/blendMode', false);
    engine.block.setScopeEnabled(block, 'layer/visibility', false);
  };

  const fullyLockedBlock = createExampleBlock(
    'Fully\nlocked',
    {
      r: 0.9,
      g: 0.5,
      b: 0.5,
    },
    disableAllScopes
  );
  // All scopes are disabled - block is completely locked and cannot be edited
  // Useful for watermarks, logos, or legal disclaimers

  // ===== Block-Level Scope Setting Example =====
  // Check if a scope is enabled for a specific block
  const canMove = engine.block.isScopeEnabled(moveLockedBlock, 'layer/move');
  const canDelete = engine.block.isScopeEnabled(
    lifecycleLockedBlock,
    'lifecycle/destroy'
  );
  const canEditFully = engine.block.isScopeEnabled(
    fullyEditableBlock,
    'layer/move'
  );
  const canEditLocked = engine.block.isScopeEnabled(
    fullyLockedBlock,
    'layer/move'
  );

  // eslint-disable-next-line no-console
  console.log('Move-locked block - layer/move enabled:', canMove); // false
  // eslint-disable-next-line no-console
  console.log('Lifecycle-locked block - lifecycle/destroy enabled:', canDelete); // false
  // eslint-disable-next-line no-console
  console.log('Fully editable block - layer/move enabled:', canEditFully); // true
  // eslint-disable-next-line no-console
  console.log('Fully locked block - layer/move enabled:', canEditLocked); // false

  // Position blocks in 2x2 grid
  const blocks = [
    fullyEditableBlock,
    moveLockedBlock,
    lifecycleLockedBlock,
    fullyLockedBlock,
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Save the scene with all scope constraints preserved
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save scene to file
  const sceneData = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/constrained-scene.scene`, sceneData);

  // eslint-disable-next-line no-console
  console.log('✓ Scene saved to output/constrained-scene.scene');
  // eslint-disable-next-line no-console
  console.log('  All scope constraints are preserved in the scene file');

  // Export the result to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/editing-constraints-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/editing-constraints-result.png');

  // Log instructions
  // eslint-disable-next-line no-console
  console.log(`
=== Editing Constraints Demo ===

Created 4 examples demonstrating scope constraints (arranged in 2x2 grid):

Top row:
1. "Fully editable" (green): All scopes enabled - complete editing freedom
2. "Locked position" (light blue): Cannot move, but can resize/edit/delete

Bottom row:
3. "Cannot delete" (light grey): Cannot delete/duplicate, but can move/resize/edit
4. "Fully locked" (red): All scopes disabled - completely locked

Note: Global scopes are set to 'Defer' to respect block-level settings.

Files created:
- output/constrained-scene.scene (scene with constraints)
- output/editing-constraints-result.png (visual result)
  `);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
