import type { EditorPlugin, EditorPluginContext, Scope } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class LockDesign implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;


    // Create sample content to demonstrate different locking techniques
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Column 1: Fully Locked
    const caption1 = engine.block.create('text');
    engine.block.setString(caption1, 'text/text', 'Fully Locked');
    engine.block.setFloat(caption1, 'text/fontSize', 32);
    engine.block.setWidth(caption1, 220);
    engine.block.setHeight(caption1, 50);
    engine.block.setPositionX(caption1, 30);
    engine.block.setPositionY(caption1, 30);
    engine.block.appendChild(page, caption1);

    const imageBlock = await engine.block.addImage(imageUri, {
      x: 30,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, imageBlock);

    // Column 2: Text Editing Only
    const caption2 = engine.block.create('text');
    engine.block.setString(caption2, 'text/text', 'Text Editing');
    engine.block.setFloat(caption2, 'text/fontSize', 32);
    engine.block.setWidth(caption2, 220);
    engine.block.setHeight(caption2, 50);
    engine.block.setPositionX(caption2, 290);
    engine.block.setPositionY(caption2, 30);
    engine.block.appendChild(page, caption2);

    const textBlock = engine.block.create('text');
    engine.block.setString(textBlock, 'text/text', 'Edit Me');
    engine.block.setFloat(textBlock, 'text/fontSize', 72);
    engine.block.setWidth(textBlock, 220);
    engine.block.setHeight(textBlock, 165);
    engine.block.setPositionX(textBlock, 290);
    engine.block.setPositionY(textBlock, 100);
    engine.block.appendChild(page, textBlock);

    // Column 3: Image Replace Only
    const caption3 = engine.block.create('text');
    engine.block.setString(caption3, 'text/text', 'Image Replace');
    engine.block.setFloat(caption3, 'text/fontSize', 32);
    engine.block.setWidth(caption3, 220);
    engine.block.setHeight(caption3, 50);
    engine.block.setPositionX(caption3, 550);
    engine.block.setPositionY(caption3, 30);
    engine.block.appendChild(page, caption3);

    const placeholderBlock = await engine.block.addImage(imageUri, {
      x: 550,
      y: 100,
      size: { width: 220, height: 165 }
    });
    engine.block.appendChild(page, placeholderBlock);

    // Lock the entire design by setting all scopes to Deny
    const scopes = engine.editor.findAllScopes();
    for (const scope of scopes) {
      engine.editor.setGlobalScope(scope, 'Deny');
    }

    // Enable selection for specific blocks
    engine.editor.setGlobalScope('editor/select', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'editor/select', true);
    engine.block.setScopeEnabled(placeholderBlock, 'editor/select', true);

    // Enable text editing on the text block
    engine.editor.setGlobalScope('text/edit', 'Defer');
    engine.editor.setGlobalScope('text/character', 'Defer');
    engine.block.setScopeEnabled(textBlock, 'text/edit', true);
    engine.block.setScopeEnabled(textBlock, 'text/character', true);

    // Enable image replacement on the placeholder block
    engine.editor.setGlobalScope('fill/change', 'Defer');
    engine.block.setScopeEnabled(placeholderBlock, 'fill/change', true);

    // Check if operations are permitted on blocks
    const canEditText = engine.block.isAllowedByScope(textBlock, 'text/edit');
    const canMoveImage = engine.block.isAllowedByScope(
      imageBlock,
      'layer/move'
    );
    const canReplacePlaceholder = engine.block.isAllowedByScope(
      placeholderBlock,
      'fill/change'
    );

    console.log('Permission status:');
    console.log('- Can edit text:', canEditText); // true
    console.log('- Can move locked image:', canMoveImage); // false
    console.log('- Can replace placeholder:', canReplacePlaceholder); // true

    // Discover all available scopes
    const allScopes: Scope[] = engine.editor.findAllScopes();
    console.log('Available scopes:', allScopes);

    // Check global scope settings
    const textEditGlobal = engine.editor.getGlobalScope('text/edit');
    const layerMoveGlobal = engine.editor.getGlobalScope('layer/move');
    console.log('Global text/edit:', textEditGlobal); // 'Defer'
    console.log('Global layer/move:', layerMoveGlobal); // 'Deny'

    // Check block-level scope settings
    const textEditEnabled = engine.block.isScopeEnabled(textBlock, 'text/edit');
    console.log('Text block text/edit enabled:', textEditEnabled); // true

    // Select the text block to demonstrate editability
    engine.block.select(textBlock);
  }
}

export default LockDesign;
