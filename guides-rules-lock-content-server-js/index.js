import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

/**
 * Logs the effective permissions for a block
 */
function logPermissions(engine, name, blockId) {
  const canMove = engine.block.isAllowedByScope(blockId, 'layer/move');
  const canResize = engine.block.isAllowedByScope(blockId, 'layer/resize');
  const canEditText = engine.block.isAllowedByScope(blockId, 'text/edit');
  const canChangeFill = engine.block.isAllowedByScope(blockId, 'fill/change');
  const canDelete = engine.block.isAllowedByScope(blockId, 'lifecycle/destroy');

  console.log(`Permissions for "${name}":`);
  console.log(`  - Move: ${canMove}`);
  console.log(`  - Resize: ${canResize}`);
  console.log(`  - Edit text: ${canEditText}`);
  console.log(`  - Change fill: ${canChangeFill}`);
  console.log(`  - Delete: ${canDelete}`);
}

/**
 * Main demonstration function
 */
async function main() {
  console.log('Starting CE.SDK Lock Content Demo...\n');

  // Initialize the engine
  const config = {
    license: process.env.CESDK_LICENSE || ''
  };

  const engine = await CreativeEngine.init(config);
  console.log('Engine initialized\n');

  try {
    // Create a design scene with a page
    engine.scene.create('VerticalStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1200);
    engine.block.setHeight(page, 800);

    const scene = engine.scene.get();
    engine.block.appendChild(scene, page);

    // Create sample content to demonstrate locking
    // Layout: 2x2 grid centered on page (1200x800)
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create an image block that will be fully locked (top-left)
    const lockedImage = await engine.block.addImage(imageUri, {
      size: { width: 300, height: 200 }
    });
    engine.block.setPositionX(lockedImage, 185);
    engine.block.setPositionY(lockedImage, 70);
    engine.block.setName(lockedImage, 'Locked Image');
    engine.block.appendChild(page, lockedImage);

    // Create a text block that allows text editing only (top-right)
    const editableText = engine.block.create('text');
    engine.block.setString(editableText, 'text/text', 'Edit me!');
    engine.block.setPositionX(editableText, 565);
    engine.block.setPositionY(editableText, 70);
    engine.block.setWidth(editableText, 450);
    engine.block.setHeight(editableText, 200);
    engine.block.setFloat(editableText, 'text/fontSize', 90);
    engine.block.setName(editableText, 'Editable Text');
    engine.block.appendChild(page, editableText);

    // Create an image block that allows image replacement only (bottom-left)
    const replaceableImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      { size: { width: 300, height: 200 } }
    );
    engine.block.setPositionX(replaceableImage, 185);
    engine.block.setPositionY(replaceableImage, 380);
    engine.block.setName(replaceableImage, 'Replaceable Image');
    engine.block.appendChild(page, replaceableImage);

    // Create a movable shape (bottom-right)
    const movableShape = engine.block.create('graphic');
    engine.block.setShape(movableShape, engine.block.createShape('rect'));
    const shapeFill = engine.block.createFill('color');
    engine.block.setColor(shapeFill, 'fill/color/value', {
      r: 0.2,
      g: 0.6,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(movableShape, shapeFill);
    engine.block.setPositionX(movableShape, 565);
    engine.block.setPositionY(movableShape, 380);
    engine.block.setWidth(movableShape, 200);
    engine.block.setHeight(movableShape, 200);
    engine.block.setName(movableShape, 'Movable Shape');
    engine.block.appendChild(page, movableShape);

    // Add description labels below each block
    const labelFontSize = 48;
    const labelY1 = 280; // Below row 1
    const labelY2 = 590; // Below row 2

    const label1 = engine.block.create('text');
    engine.block.setString(label1, 'text/text', 'Fully Locked');
    engine.block.setPositionX(label1, 185);
    engine.block.setPositionY(label1, labelY1);
    engine.block.setWidth(label1, 300);
    engine.block.setHeight(label1, 60);
    engine.block.setFloat(label1, 'text/fontSize', labelFontSize);
    engine.block.setEnum(label1, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, label1);

    const label2 = engine.block.create('text');
    engine.block.setString(label2, 'text/text', 'Text Editable');
    engine.block.setPositionX(label2, 565);
    engine.block.setPositionY(label2, labelY1);
    engine.block.setWidth(label2, 450);
    engine.block.setHeight(label2, 60);
    engine.block.setFloat(label2, 'text/fontSize', labelFontSize);
    engine.block.setEnum(label2, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, label2);

    const label3 = engine.block.create('text');
    engine.block.setString(label3, 'text/text', 'Image Replaceable');
    engine.block.setPositionX(label3, 185);
    engine.block.setPositionY(label3, labelY2);
    engine.block.setWidth(label3, 300);
    engine.block.setHeight(label3, 60);
    engine.block.setFloat(label3, 'text/fontSize', labelFontSize);
    engine.block.setEnum(label3, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, label3);

    const label4 = engine.block.create('text');
    engine.block.setString(label4, 'text/text', 'Move & Resize');
    engine.block.setPositionX(label4, 565);
    engine.block.setPositionY(label4, labelY2);
    engine.block.setWidth(label4, 200);
    engine.block.setHeight(label4, 60);
    engine.block.setFloat(label4, 'text/fontSize', labelFontSize);
    engine.block.setEnum(label4, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, label4);

    console.log('Created sample content\n');

    // Get all available scopes
    const allScopes = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);
    console.log('');

    // Step 1: Lock everything by setting all global scopes to 'Deny'
    for (const scope of allScopes) {
      engine.editor.setGlobalScope(scope, 'Deny');
    }
    console.log('All scopes locked globally\n');

    // Enable selection for interactive blocks (required for any interaction)
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.block.setScopeEnabled(editableText, 'editor/select', true);
    engine.block.setScopeEnabled(replaceableImage, 'editor/select', true);
    engine.block.setScopeEnabled(movableShape, 'editor/select', true);

    // Step 2: Allow text editing on specific blocks
    // Set text/edit scope to 'Defer' so block-level settings take effect
    engine.editor.setGlobalScope('text/edit', 'Defer');
    engine.editor.setGlobalScope('text/character', 'Defer');

    // Enable text editing on the editable text block
    engine.block.setScopeEnabled(editableText, 'text/edit', true);
    engine.block.setScopeEnabled(editableText, 'text/character', true);
    console.log(
      'Text editing enabled for:',
      engine.block.getName(editableText)
    );

    // Step 3: Allow image replacement on specific blocks
    // Set fill/change scope to 'Defer'
    engine.editor.setGlobalScope('fill/change', 'Defer');

    // Enable image replacement on the replaceable image block
    engine.block.setScopeEnabled(replaceableImage, 'fill/change', true);
    console.log(
      'Image replacement enabled for:',
      engine.block.getName(replaceableImage)
    );

    // Step 4: Allow repositioning of specific blocks
    // Set layer/move scope to 'Defer'
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');

    // Enable movement and resizing on the movable shape
    engine.block.setScopeEnabled(movableShape, 'layer/move', true);
    engine.block.setScopeEnabled(movableShape, 'layer/resize', true);
    console.log(
      'Position adjustment enabled for:',
      engine.block.getName(movableShape)
    );
    console.log('');

    // Step 5: Verify the effective permissions
    console.log('=== Permission Summary ===\n');
    logPermissions(engine, 'Locked Image', lockedImage);
    console.log('');
    logPermissions(engine, 'Editable Text', editableText);
    console.log('');
    logPermissions(engine, 'Replaceable Image', replaceableImage);
    console.log('');
    logPermissions(engine, 'Movable Shape', movableShape);
    console.log('');

    // Export the design
    console.log('Exporting design...');
    const blob = await engine.block.export(page, 'image/png');
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Save to output directory
    if (!existsSync('./output')) {
      mkdirSync('./output', { recursive: true });
    }
    writeFileSync('./output/locked-design.png', buffer);
    console.log('Design exported to ./output/locked-design.png\n');

    console.log('Demo complete!');
  } finally {
    // Clean up
    engine.dispose();
    console.log('Engine disposed');
  }
}

// Run the demo
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
