import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Demonstrates CE.SDK's role-based permission system with scopes.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Roles define user types: 'Creator', 'Adopter', 'Viewer', 'Presenter'
    const role = engine.editor.getRole();
    console.log('Current role:', role); // 'Creator'

    // Configure scopes when role changes (role change resets to defaults)
    engine.editor.onRoleChanged(() => {
      // Set global scopes to 'Defer' so block-level scopes take effect
      engine.editor.setGlobalScope('editor/select', 'Defer');
      engine.editor.setGlobalScope('layer/move', 'Defer');
      engine.editor.setGlobalScope('text/edit', 'Defer');
      engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    });

    // Get page dimensions for centering
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a locked text block (brand element)
    const lockedText = engine.block.create('text');
    engine.block.replaceText(lockedText, 'Locked Text');
    engine.block.setTextFontSize(lockedText, 40);
    engine.block.setEnum(lockedText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(lockedText, pageWidth);
    engine.block.setHeightMode(lockedText, 'Auto');
    engine.block.setPositionX(lockedText, 0);
    engine.block.setPositionY(lockedText, pageHeight / 2 - 50);
    engine.block.appendChild(page, lockedText);

    // Lock the block - Adopters cannot select, edit, or move it
    engine.block.setScopeEnabled(lockedText, 'editor/select', false);
    engine.block.setScopeEnabled(lockedText, 'text/edit', false);
    engine.block.setScopeEnabled(lockedText, 'layer/move', false);
    engine.block.setScopeEnabled(lockedText, 'lifecycle/destroy', false);

    // Create an editable text block (user content)
    const editableText = engine.block.create('text');
    engine.block.replaceText(editableText, 'Editable Text');
    engine.block.setTextFontSize(editableText, 40);
    engine.block.setEnum(editableText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(editableText, pageWidth);
    engine.block.setHeightMode(editableText, 'Auto');
    engine.block.setPositionX(editableText, 0);
    engine.block.setPositionY(editableText, pageHeight / 2 + 10);
    engine.block.appendChild(page, editableText);

    // Center both texts vertically as a group
    const lockedHeight = engine.block.getFrameHeight(lockedText);
    const editableHeight = engine.block.getFrameHeight(editableText);
    const gap = 20;
    const totalHeight = lockedHeight + gap + editableHeight;
    const topMargin = (pageHeight - totalHeight) / 2;
    engine.block.setPositionY(lockedText, topMargin);
    engine.block.setPositionY(editableText, topMargin + lockedHeight + gap);

    // Editable block - enable selection and editing
    engine.block.setScopeEnabled(editableText, 'editor/select', true);
    engine.block.setScopeEnabled(editableText, 'text/edit', true);
    engine.block.setScopeEnabled(editableText, 'layer/move', true);

    // Check resolved permissions (role + global + block scopes)
    const canEditLocked = engine.block.isAllowedByScope(
      lockedText,
      'text/edit'
    );
    const canEditEditable = engine.block.isAllowedByScope(
      editableText,
      'text/edit'
    );
    // As Creator: both return true (Creators bypass restrictions)
    console.log(
      'Can edit locked:',
      canEditLocked,
      'Can edit editable:',
      canEditEditable
    );

    // Switch to Adopter to apply restrictions
    engine.editor.setRole('Adopter');

    // Select the editable block to show it's interactive
    engine.block.select(editableText);
  }
}

export default Example;
