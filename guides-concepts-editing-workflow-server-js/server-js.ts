import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    engine.scene.create('VerticalStack');
    const page = engine.block.findByType('page')[0];

    // Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
    const role = engine.editor.getRole();
    console.log('Current role:', role); // 'Creator'

    // Global scopes: 'Allow', 'Deny', or 'Defer' (to block-level)
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

    // Create a block and lock it
    const block = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      block,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 100);
    engine.block.appendChild(page, block);

    // Lock the block - Adopters cannot select, move, or delete it
    engine.block.setScopeEnabled(block, 'editor/select', false);
    engine.block.setScopeEnabled(block, 'layer/move', false);
    engine.block.setScopeEnabled(block, 'lifecycle/destroy', false);

    // Check resolved permissions (role + global + block scopes)
    const canMoveAsCreator = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Creator can move:', canMoveAsCreator); // true

    engine.editor.setRole('Adopter');
    const canMoveAsAdopter = engine.block.isAllowedByScope(block, 'layer/move');
    console.log('Adopter can move:', canMoveAsAdopter); // false
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
