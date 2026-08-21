import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';

config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page and a selected block so selection-based
    // actions have a target
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 100);
    engine.block.setPositionY(block, 100);
    engine.block.appendChild(page, block);
    engine.block.setSelected(block, true);

    // Engine defaults act on the current selection
    const moved = await engine.actions.run('nudge', { dx: 10, dy: 0 });
    console.log('Selection moved:', moved); // true

    await engine.actions.run('selection.duplicate');
    console.log('Blocks on page:', engine.block.getChildren(page).length);

    // Explicitly targeted actions take their targets as arguments
    await engine.actions.run('select', { ids: [block] });
    console.log('Selected blocks:', engine.block.findAllSelected()); // [block]

    // Register a custom action under your own id
    engine.actions.register('myCompany.audit', (event: string) => {
      const selected = engine.block.findAllSelected();
      return { event, selectedBlocks: selected.length };
    });

    const audit = await engine.actions.run('myCompany.audit', 'export');
    console.log('Audit result:', audit); // { event: 'export', selectedBlocks: 1 }

    // Override an engine default: hide instead of destroy
    engine.actions.register('selection.delete', () => {
      const selected = engine.block.findAllSelected();
      selected.forEach((id) => engine.block.setVisible(id, false));
      return selected.length;
    });

    const hidden = await engine.actions.run('selection.delete');
    console.log('Hidden blocks:', hidden); // 1

    // Unregistering an overridden engine default restores the built-in behavior
    engine.actions.unregister('selection.delete');

    // Discover registered actions, optionally filtered by a glob matcher
    const all = engine.actions.list();
    console.log('Registered actions:', all.length);

    const selectionActions = engine.actions.list({ matcher: 'selection.*' });
    selectionActions.forEach(({ id, enabled }) => {
      console.log(`${id} (enabled: ${enabled})`);
    });

    // Test for an action by id
    console.log('Has nudge:', engine.actions.has('nudge')); // true

    // get() returns the raw function for actions you registered ...
    const auditFn = engine.actions.get('myCompany.audit');
    if (auditFn != null) {
      console.log('Sync call:', auditFn('archive'));
    }

    // ... and undefined for engine-default native actions - use run() for those
    console.log('Get nudge:', engine.actions.get('nudge')); // undefined

    // Remove a custom action entirely
    engine.actions.unregister('myCompany.audit');
    console.log('Has audit:', engine.actions.has('myCompany.audit')); // false

    // Export the scene as an image to verify the result
    await mkdir('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    await writeFile('output/actions.png', Buffer.from(await blob.arrayBuffer()));
    console.log('Exported preview: output/actions.png');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
