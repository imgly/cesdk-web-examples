import CreativeEngine from '@cesdk/engine';

async function movementConstraints() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    const scene = engine.scene.create();

    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    const block = engine.block.create('graphic');
    engine.block.appendChild(page, block);

    // Allow every block in the scene to overshoot by 20% of its own size.
    engine.editor.setMovementConstraint({ overshoot: 0.2 });

    // Pin all text and caption blocks fully inside the page.
    engine.editor.setMovementConstraint([
      { overshoot: 0, blockType: 'text' },
      { overshoot: 0, blockType: 'caption' }
    ]);

    // Override the scene-wide default for blocks on this page.
    engine.editor.setMovementConstraint({ overshoot: 0.1, block: page });

    // Override every other level for one specific block.
    engine.editor.setMovementConstraint({ overshoot: 0, block });

    // Read the resolved constraint, walking the priority chain:
    // block > parent page > blockType > scene-wide.
    const active = engine.editor.getMovementConstraint(block);

    // Clear a scope by passing the matching descriptor. Use no argument to
    // remove the scene-wide default.
    engine.editor.removeMovementConstraint({ block }); // per-block
    engine.editor.removeMovementConstraint({ blockType: 'text' }); // per-type
    engine.editor.removeMovementConstraint({ block: page }); // per-page
    engine.editor.removeMovementConstraint(); // scene-wide default

    return active;
  } finally {
    engine.dispose();
  }
}

movementConstraints();

