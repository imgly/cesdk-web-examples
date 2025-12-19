import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculatePyramidLayout } from './utils';

/**
 * CE.SDK Plugin: Rules Overview Guide
 *
 * Demonstrates the scopes system for enforcing editing rules and constraints.
 * Shows global scopes, block-level scopes, and how they control editing operations
 * across different scope categories including layer, appearance, content, and lifecycle scopes.
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    engine.block.setWidth(page, 1600);
    engine.block.setHeight(page, 1000);

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate grid layout using utility function
    const layout = calculatePyramidLayout(pageWidth, pageHeight);

    // Different sample images for each block
    const imageUris = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg'
    ];

    // Set global scopes to Defer - this allows block-level control
    // Layer operations
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');
    engine.editor.setGlobalScope('layer/rotate', 'Defer');
    engine.editor.setGlobalScope('layer/flip', 'Defer');
    engine.editor.setGlobalScope('layer/crop', 'Defer');
    engine.editor.setGlobalScope('layer/opacity', 'Defer');
    engine.editor.setGlobalScope('layer/blendMode', 'Defer');
    engine.editor.setGlobalScope('layer/visibility', 'Defer');
    engine.editor.setGlobalScope('layer/clipping', 'Defer');

    // Appearance
    engine.editor.setGlobalScope('appearance/adjustments', 'Defer');
    engine.editor.setGlobalScope('appearance/filter', 'Defer');
    engine.editor.setGlobalScope('appearance/effect', 'Defer');
    engine.editor.setGlobalScope('appearance/blur', 'Defer');
    engine.editor.setGlobalScope('appearance/shadow', 'Defer');

    // Content editing
    engine.editor.setGlobalScope('fill/change', 'Defer');
    engine.editor.setGlobalScope('fill/changeType', 'Defer');
    engine.editor.setGlobalScope('stroke/change', 'Defer');

    // Lifecycle
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');
    engine.editor.setGlobalScope('editor/add', 'Defer');
    engine.editor.setGlobalScope('editor/select', 'Defer');

    // Create 5 image blocks - one for each scope category plus fully enabled
    // Block 1: Layer Operations Disabled (top row)
    const layerBlock = await engine.block.addImage(imageUris[0], {
      size: { width: layout.blockWidth, height: layout.blockHeight }
    });
    const pos1 = layout.getBlockPosition(0);
    engine.block.setPositionX(layerBlock, pos1.x);
    engine.block.setPositionY(layerBlock, pos1.y);
    engine.block.appendChild(page, layerBlock);
    engine.block.setName(layerBlock, 'Layer Operations Disabled');

    // Block 2: Appearance Disabled (top row)
    const appearanceBlock = await engine.block.addImage(imageUris[1], {
      size: { width: layout.blockWidth, height: layout.blockHeight }
    });
    const pos2 = layout.getBlockPosition(1);
    engine.block.setPositionX(appearanceBlock, pos2.x);
    engine.block.setPositionY(appearanceBlock, pos2.y);
    engine.block.appendChild(page, appearanceBlock);
    engine.block.setName(appearanceBlock, 'Appearance Disabled');

    // Block 3: Content Editing Disabled (top row)
    const contentBlock = await engine.block.addImage(imageUris[2], {
      size: { width: layout.blockWidth, height: layout.blockHeight }
    });
    const pos3 = layout.getBlockPosition(2);
    engine.block.setPositionX(contentBlock, pos3.x);
    engine.block.setPositionY(contentBlock, pos3.y);
    engine.block.appendChild(page, contentBlock);
    engine.block.setName(contentBlock, 'Content Editing Disabled');

    // Block 4: All Scopes Disabled (bottom row) - fully locked
    const lockedBlock = await engine.block.addImage(imageUris[3], {
      size: { width: layout.blockWidth, height: layout.blockHeight }
    });
    const pos4 = layout.getBlockPosition(3);
    engine.block.setPositionX(lockedBlock, pos4.x);
    engine.block.setPositionY(lockedBlock, pos4.y);
    engine.block.appendChild(page, lockedBlock);
    engine.block.setName(lockedBlock, 'All Scopes Disabled');

    // Block 5: Fully Enabled - all scopes enabled (bottom row)
    const enabledBlock = await engine.block.addImage(imageUris[4], {
      size: { width: layout.blockWidth, height: layout.blockHeight }
    });
    const pos5 = layout.getBlockPosition(4);
    engine.block.setPositionX(enabledBlock, pos5.x);
    engine.block.setPositionY(enabledBlock, pos5.y);
    engine.block.appendChild(page, enabledBlock);
    engine.block.setName(enabledBlock, 'All Scopes Enabled');

    // Block 1: Disable all layer operations
    engine.block.setScopeEnabled(layerBlock, 'layer/move', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/rotate', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/flip', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/crop', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/opacity', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/blendMode', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/visibility', false);
    engine.block.setScopeEnabled(layerBlock, 'layer/clipping', false);
    // Keep other scopes enabled
    engine.block.setScopeEnabled(layerBlock, 'appearance/adjustments', true);
    engine.block.setScopeEnabled(layerBlock, 'appearance/filter', true);
    engine.block.setScopeEnabled(layerBlock, 'fill/change', true);
    engine.block.setScopeEnabled(layerBlock, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(layerBlock, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(layerBlock, 'editor/select', true);

    // Block 2: Disable all appearance scopes
    engine.block.setScopeEnabled(
      appearanceBlock,
      'appearance/adjustments',
      false
    );
    engine.block.setScopeEnabled(appearanceBlock, 'appearance/filter', false);
    engine.block.setScopeEnabled(appearanceBlock, 'appearance/effect', false);
    engine.block.setScopeEnabled(appearanceBlock, 'appearance/blur', false);
    engine.block.setScopeEnabled(appearanceBlock, 'appearance/shadow', false);
    // Keep other scopes enabled
    engine.block.setScopeEnabled(appearanceBlock, 'layer/move', true);
    engine.block.setScopeEnabled(appearanceBlock, 'layer/resize', true);
    engine.block.setScopeEnabled(appearanceBlock, 'layer/rotate', true);
    engine.block.setScopeEnabled(appearanceBlock, 'fill/change', true);
    engine.block.setScopeEnabled(appearanceBlock, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(appearanceBlock, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(appearanceBlock, 'editor/select', true);

    // Block 3: Disable all content editing scopes
    engine.block.setScopeEnabled(contentBlock, 'fill/change', false);
    engine.block.setScopeEnabled(contentBlock, 'fill/changeType', false);
    engine.block.setScopeEnabled(contentBlock, 'stroke/change', false);
    // Keep other scopes enabled
    engine.block.setScopeEnabled(contentBlock, 'layer/move', true);
    engine.block.setScopeEnabled(contentBlock, 'layer/resize', true);
    engine.block.setScopeEnabled(contentBlock, 'layer/rotate', true);
    engine.block.setScopeEnabled(contentBlock, 'appearance/adjustments', true);
    engine.block.setScopeEnabled(contentBlock, 'appearance/filter', true);
    engine.block.setScopeEnabled(contentBlock, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(contentBlock, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(contentBlock, 'editor/select', true);

    // Block 4: Disable all scopes (fully locked)
    engine.block.setScopeEnabled(lockedBlock, 'layer/move', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/rotate', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/flip', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/crop', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/opacity', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/blendMode', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/visibility', false);
    engine.block.setScopeEnabled(lockedBlock, 'layer/clipping', false);
    engine.block.setScopeEnabled(lockedBlock, 'appearance/adjustments', false);
    engine.block.setScopeEnabled(lockedBlock, 'appearance/filter', false);
    engine.block.setScopeEnabled(lockedBlock, 'appearance/effect', false);
    engine.block.setScopeEnabled(lockedBlock, 'appearance/blur', false);
    engine.block.setScopeEnabled(lockedBlock, 'appearance/shadow', false);
    engine.block.setScopeEnabled(lockedBlock, 'fill/change', false);
    engine.block.setScopeEnabled(lockedBlock, 'fill/changeType', false);
    engine.block.setScopeEnabled(lockedBlock, 'stroke/change', false);
    engine.block.setScopeEnabled(lockedBlock, 'lifecycle/destroy', false);
    engine.block.setScopeEnabled(lockedBlock, 'lifecycle/duplicate', false);
    engine.block.setScopeEnabled(lockedBlock, 'editor/add', false);
    engine.block.setScopeEnabled(lockedBlock, 'editor/select', false);

    // Block 5: Enable all scopes (fully editable)
    engine.block.setScopeEnabled(enabledBlock, 'layer/move', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/resize', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/rotate', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/flip', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/crop', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/opacity', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/blendMode', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/visibility', true);
    engine.block.setScopeEnabled(enabledBlock, 'layer/clipping', true);
    engine.block.setScopeEnabled(enabledBlock, 'appearance/adjustments', true);
    engine.block.setScopeEnabled(enabledBlock, 'appearance/filter', true);
    engine.block.setScopeEnabled(enabledBlock, 'appearance/effect', true);
    engine.block.setScopeEnabled(enabledBlock, 'appearance/blur', true);
    engine.block.setScopeEnabled(enabledBlock, 'appearance/shadow', true);
    engine.block.setScopeEnabled(enabledBlock, 'fill/change', true);
    engine.block.setScopeEnabled(enabledBlock, 'fill/changeType', true);
    engine.block.setScopeEnabled(enabledBlock, 'stroke/change', true);
    engine.block.setScopeEnabled(enabledBlock, 'lifecycle/destroy', true);
    engine.block.setScopeEnabled(enabledBlock, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(enabledBlock, 'editor/add', true);
    engine.block.setScopeEnabled(enabledBlock, 'editor/select', true);

    // Create text labels below each block
    const labels = [
      { text: 'Layer Operations', constraint: 'Disabled' },
      { text: 'Appearance', constraint: 'Disabled' },
      { text: 'Content Editing', constraint: 'Disabled' },
      { text: 'All Scopes', constraint: 'Disabled' },
      { text: 'All Scopes', constraint: 'Enabled' }
    ];

    for (let i = 0; i < labels.length; i++) {
      const labelPos = layout.getLabelPosition(i);
      const label = engine.block.create('text');
      engine.block.setWidth(label, layout.blockWidth);
      engine.block.setHeight(label, layout.labelHeight);
      engine.block.setPositionX(label, labelPos.x);
      engine.block.setPositionY(label, labelPos.y);
      engine.block.appendChild(page, label);
      engine.block.replaceText(
        label,
        `${labels[i].text}\n${labels[i].constraint}`
      );
      engine.block.setFloat(label, 'text/fontSize', 48);
      engine.block.setEnum(label, 'text/horizontalAlignment', 'Center');
      engine.block.setEnum(label, 'text/verticalAlignment', 'Top');

      // Lock the label so it can't be edited
      engine.block.setScopeEnabled(label, 'layer/move', false);
      engine.block.setScopeEnabled(label, 'layer/resize', false);
      engine.block.setScopeEnabled(label, 'lifecycle/destroy', false);
      engine.block.setScopeEnabled(label, 'editor/select', false);
    }

    // Check if operations are allowed for each block
    const canMoveLayer = engine.block.isAllowedByScope(
      layerBlock,
      'layer/move'
    );
    const canMoveEnabled = engine.block.isAllowedByScope(
      enabledBlock,
      'layer/move'
    );
    const canMoveLocked = engine.block.isAllowedByScope(
      lockedBlock,
      'layer/move'
    );

    console.log(`Layer block - can move: ${canMoveLayer}`); // false
    console.log(`Enabled block - can move: ${canMoveEnabled}`); // true
    console.log(`Locked block - can move: ${canMoveLocked}`); // false

    // Demonstrate global Deny - would block all operations regardless of block settings
    // Example: engine.editor.setGlobalScope('layer/flip', 'Deny');
    // This would prevent flipping on ALL blocks, even the fully enabled one

    // Zoom to fit the page in the viewport
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }
}

export default Example;
