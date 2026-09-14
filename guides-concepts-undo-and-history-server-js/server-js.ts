import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Subscribe to history updates to track state changes
  const unsubscribe = engine.editor.onHistoryUpdated(() => {
    const canUndo = engine.editor.canUndo();
    const canRedo = engine.editor.canRedo();
    console.log('History updated:', { canUndo, canRedo });
  });

  // Create a triangle shape and add an undo step to record it in history
  const block = engine.block.create('graphic');
  engine.block.setPositionX(block, 140);
  engine.block.setPositionY(block, 95);
  engine.block.setWidth(block, 265);
  engine.block.setHeight(block, 265);
  const triangleShape = engine.block.createShape('polygon');
  engine.block.setInt(triangleShape, 'shape/polygon/sides', 3);
  engine.block.setShape(block, triangleShape);
  const triangleFill = engine.block.createFill('color');
  engine.block.setColor(triangleFill, 'fill/color/value', {
    r: 0.2,
    g: 0.5,
    b: 0.9,
    a: 1
  });
  engine.block.setFill(block, triangleFill);
  engine.block.appendChild(page, block);
  // Commit the block creation to history so it can be undone
  engine.editor.addUndoStep();

  // Log current state - canUndo should now be true
  console.log('Block created. canUndo:', engine.editor.canUndo());

  // Undo the block creation
  if (engine.editor.canUndo()) {
    engine.editor.undo();
    console.log(
      'After undo - canUndo:',
      engine.editor.canUndo(),
      'canRedo:',
      engine.editor.canRedo()
    );
  }

  // Redo to restore the block
  if (engine.editor.canRedo()) {
    engine.editor.redo();
    console.log(
      'After redo - canUndo:',
      engine.editor.canUndo(),
      'canRedo:',
      engine.editor.canRedo()
    );
  }

  // Create a second history stack for isolated operations
  const secondaryHistory = engine.editor.createHistory();
  const primaryHistory = engine.editor.getActiveHistory();
  console.log(
    'Created secondary history. Primary:',
    primaryHistory,
    'Secondary:',
    secondaryHistory
  );

  // Switch to the secondary history
  engine.editor.setActiveHistory(secondaryHistory);
  console.log(
    'Switched to secondary history. Active:',
    engine.editor.getActiveHistory()
  );

  // Operations in secondary history are isolated from the primary history
  const secondBlock = engine.block.create('graphic');
  engine.block.setPositionX(secondBlock, 440);
  engine.block.setPositionY(secondBlock, 95);
  engine.block.setWidth(secondBlock, 220);
  engine.block.setHeight(secondBlock, 220);
  const circleShape = engine.block.createShape('ellipse');
  engine.block.setShape(secondBlock, circleShape);
  const circleFill = engine.block.createFill('color');
  engine.block.setColor(circleFill, 'fill/color/value', {
    r: 0.9,
    g: 0.3,
    b: 0.3,
    a: 1
  });
  engine.block.setFill(secondBlock, circleFill);
  engine.block.appendChild(page, secondBlock);
  // Commit changes to the secondary history
  engine.editor.addUndoStep();
  console.log(
    'Block added in secondary history. canUndo:',
    engine.editor.canUndo()
  );

  // Switch back to primary history
  engine.editor.setActiveHistory(primaryHistory);
  console.log(
    'Switched back to primary history. canUndo:',
    engine.editor.canUndo()
  );

  // Clean up the secondary history when no longer needed
  engine.editor.destroyHistory(secondaryHistory);
  console.log('Secondary history destroyed');

  // Manually add an undo step after custom operations
  engine.block.setPositionX(block, 190);
  engine.editor.addUndoStep();
  console.log('Manual undo step added. canUndo:', engine.editor.canUndo());

  // Remove the most recent undo step if needed
  if (engine.editor.canUndo()) {
    engine.editor.removeUndoStep();
    console.log('Most recent undo step removed');
  }
  // Reset block position to its original location
  engine.block.setPositionX(block, 140);

  // Clean up subscription
  unsubscribe();

  console.log('Undo and history demo completed successfully');
} finally {
  // Always dispose of the engine when done
  engine.dispose();
}
