import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Dynamic Content Placeholders
 *
 * This example demonstrates three different placeholder configurations:
 * 1. All placeholder controls enabled (all scopes + behavior + controls)
 * 2. Fill properties only (fill scopes + behavior + controls)
 * 3. No placeholder features (default state)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDemoAssetSources();
    await cesdk.addDefaultAssetSources();

    // Create a design scene using CE.SDK method
    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    engine.editor.setRole('Adopter');

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions for horizontal layout
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Layout configuration for 3 blocks horizontally
    const blockWidth = 300;
    const blockHeight = 300;
    const spacing = 50;
    const startX = (pageWidth - blockWidth * 3 - spacing * 2) / 2;
    const blockY = (pageHeight - blockHeight) / 2 + 40; // Offset for labels
    const labelY = blockY - 50;

    // Sample images
    const imageUri1 = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageUri2 = 'https://img.ly/static/ubq_samples/sample_2.jpg';
    const imageUri3 = 'https://img.ly/static/ubq_samples/sample_3.jpg';

    // Define ALL available scopes for reference
    const allScopes: Array<
      | 'text/edit'
      | 'text/character'
      | 'fill/change'
      | 'fill/changeType'
      | 'stroke/change'
      | 'shape/change'
      | 'layer/move'
      | 'layer/resize'
      | 'layer/rotate'
      | 'layer/flip'
      | 'layer/crop'
      | 'layer/opacity'
      | 'layer/blendMode'
      | 'layer/visibility'
      | 'layer/clipping'
      | 'appearance/adjustments'
      | 'appearance/filter'
      | 'appearance/effect'
      | 'appearance/blur'
      | 'appearance/shadow'
      | 'appearance/animation'
      | 'lifecycle/destroy'
      | 'lifecycle/duplicate'
      | 'editor/add'
      | 'editor/select'
    > = [
      'text/edit',
      'text/character',
      'fill/change',
      'fill/changeType',
      'stroke/change',
      'shape/change',
      'layer/move',
      'layer/resize',
      'layer/rotate',
      'layer/flip',
      'layer/crop',
      'layer/opacity',
      'layer/blendMode',
      'layer/visibility',
      'layer/clipping',
      'appearance/adjustments',
      'appearance/filter',
      'appearance/effect',
      'appearance/blur',
      'appearance/shadow',
      'appearance/animation',
      'lifecycle/destroy',
      'lifecycle/duplicate',
      'editor/add',
      'editor/select'
    ];

    // Block 1: All Placeholder Controls Enabled
    const block1 = await engine.block.addImage(imageUri1, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block1);
    engine.block.setPositionX(block1, startX);
    engine.block.setPositionY(block1, blockY);

    // Step 1: Explicitly disable ALL scopes first
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block1, scope, false);
    });

    // Step 2: Enable specific scopes for full placeholder functionality
    // General/Layer options
    engine.block.setScopeEnabled(block1, 'layer/opacity', true);
    engine.block.setScopeEnabled(block1, 'layer/blendMode', true);
    engine.block.setScopeEnabled(block1, 'lifecycle/duplicate', true);
    engine.block.setScopeEnabled(block1, 'lifecycle/destroy', true);

    // Arrange scopes
    engine.block.setScopeEnabled(block1, 'layer/move', true);
    engine.block.setScopeEnabled(block1, 'layer/resize', true);
    engine.block.setScopeEnabled(block1, 'layer/rotate', true);
    engine.block.setScopeEnabled(block1, 'layer/flip', true);

    // Fill scopes (for image replacement and cropping)
    engine.block.setScopeEnabled(block1, 'fill/change', true);
    engine.block.setScopeEnabled(block1, 'fill/changeType', true);
    engine.block.setScopeEnabled(block1, 'layer/crop', true);

    // Appearance scopes
    engine.block.setScopeEnabled(block1, 'appearance/adjustments', true);
    engine.block.setScopeEnabled(block1, 'appearance/filter', true);
    engine.block.setScopeEnabled(block1, 'appearance/effect', true);
    engine.block.setScopeEnabled(block1, 'appearance/blur', true);
    engine.block.setScopeEnabled(block1, 'appearance/shadow', true);
    engine.block.setScopeEnabled(block1, 'appearance/animation', true);
    engine.block.setScopeEnabled(block1, 'editor/select', true);

    // Step 3: Enable placeholder behavior ("Act as a placeholder")
    // This makes the block interactive in Adopter mode
    engine.block.setPlaceholderEnabled(block1, true);

    // Step 4: Check if block/fill supports placeholder features
    const fill1 = engine.block.getFill(block1);
    const supportsBehavior = engine.block.supportsPlaceholderBehavior(fill1);
    const supportsControls = engine.block.supportsPlaceholderControls(block1);

    // Enable placeholder behavior on the fill (for graphic blocks)
    if (supportsBehavior) {
      engine.block.setPlaceholderBehaviorEnabled(fill1, true);
    }

    // Enable placeholder overlay pattern
    if (supportsControls) {
      engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
    }

    // Enable placeholder button
    if (supportsControls) {
      engine.block.setPlaceholderControlsButtonEnabled(block1, true);
    }

    // Complete "Act as Placeholder" setup
    const fillForConfig = engine.block.getFill(block1);
    if (engine.block.supportsPlaceholderBehavior(fillForConfig)) {
      engine.block.setPlaceholderBehaviorEnabled(fillForConfig, true);
    }
    if (supportsControls) {
      engine.block.setPlaceholderControlsOverlayEnabled(block1, true);
      engine.block.setPlaceholderControlsButtonEnabled(block1, true);
    }

    // Block 2: Fill Properties Only
    const block2 = await engine.block.addImage(imageUri2, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block2);
    engine.block.setPositionX(block2, startX + blockWidth + spacing);
    engine.block.setPositionY(block2, blockY);

    // Batch operation: Apply settings to multiple blocks
    const graphicBlocks = [block1, block2];
    graphicBlocks.forEach((block) => {
      // Enable placeholder for each block
      engine.block.setPlaceholderEnabled(block, true);

      const fill = engine.block.getFill(block);
      if (engine.block.supportsPlaceholderBehavior(fill)) {
        engine.block.setPlaceholderBehaviorEnabled(fill, true);
      }
    });

    // Step 1: Explicitly disable ALL scopes first
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block2, scope, false);
    });

    // Step 2: Enable ONLY fill-related scopes
    engine.block.setScopeEnabled(block2, 'fill/change', true);
    engine.block.setScopeEnabled(block2, 'fill/changeType', true);
    engine.block.setScopeEnabled(block2, 'layer/crop', true);
    engine.block.setScopeEnabled(block2, 'editor/select', true);

    // Step 3: Enable placeholder behavior ("Act as a placeholder")
    engine.block.setPlaceholderEnabled(block2, true);

    // Step 4: Enable fill-based placeholder behavior and visual controls
    const fill2 = engine.block.getFill(block2);
    if (engine.block.supportsPlaceholderBehavior(fill2)) {
      engine.block.setPlaceholderBehaviorEnabled(fill2, true);
    }

    if (engine.block.supportsPlaceholderControls(block2)) {
      engine.block.setPlaceholderControlsOverlayEnabled(block2, true);
      engine.block.setPlaceholderControlsButtonEnabled(block2, true);
    }

    // Block 3: No Placeholder Features (Default State)
    const block3 = await engine.block.addImage(imageUri3, {
      size: {
        width: blockWidth,
        height: blockHeight
      }
    });
    engine.block.appendChild(page, block3);
    engine.block.setPositionX(block3, startX + (blockWidth + spacing) * 2);
    engine.block.setPositionY(block3, blockY);

    // Explicitly disable ALL scopes to ensure default state
    allScopes.forEach((scope) => {
      engine.block.setScopeEnabled(block3, scope, false);
    });

    // No placeholder behavior enabled - this block remains non-interactive

    // Add descriptive labels above each block
    const labelConfig = {
      height: 40,
      fontSize: 34,
      fontUri:
        'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf',
      fontFamily: 'Roboto'
    };

    // Label for Block 1
    const label1 = engine.block.create('text');
    engine.block.appendChild(page, label1);
    engine.block.setPositionX(label1, startX);
    engine.block.setPositionY(label1, labelY);
    engine.block.setWidth(label1, blockWidth);
    engine.block.setHeight(label1, labelConfig.height);
    engine.block.replaceText(label1, 'All Controls');
    engine.block.setTextColor(label1, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label1, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label1, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label1, 'text/horizontalAlignment', 'Center');

    // Label for Block 2
    const label2 = engine.block.create('text');
    engine.block.appendChild(page, label2);
    engine.block.setPositionX(label2, startX + blockWidth + spacing);
    engine.block.setPositionY(label2, labelY);
    engine.block.setWidth(label2, blockWidth);
    engine.block.setHeight(label2, labelConfig.height);
    engine.block.replaceText(label2, 'Fill Only');
    engine.block.setTextColor(label2, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label2, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label2, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label2, 'text/horizontalAlignment', 'Center');

    // Label for Block 3
    const label3 = engine.block.create('text');
    engine.block.appendChild(page, label3);
    engine.block.setPositionX(label3, startX + (blockWidth + spacing) * 2);
    engine.block.setPositionY(label3, labelY);
    engine.block.setWidth(label3, blockWidth);
    engine.block.setHeight(label3, labelConfig.height);
    engine.block.replaceText(label3, 'Disabled');
    engine.block.setTextColor(label3, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFont(label3, labelConfig.fontUri, {
      name: labelConfig.fontFamily,
      fonts: [
        {
          uri: labelConfig.fontUri,
          subFamily: 'Bold'
        }
      ]
    });
    engine.block.setFloat(label3, 'text/fontSize', labelConfig.fontSize);
    engine.block.setEnum(label3, 'text/horizontalAlignment', 'Center');

    // Verify configurations
    // eslint-disable-next-line no-console
    console.log('Block 1 - All Controls:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block1)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block1, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/resize:',
      engine.block.isScopeEnabled(block1, 'layer/resize')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block1, 'fill/change')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/crop:',
      engine.block.isScopeEnabled(block1, 'layer/crop')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - appearance/adjustments:',
      engine.block.isScopeEnabled(block1, 'appearance/adjustments')
    );

    // eslint-disable-next-line no-console
    console.log('\nBlock 2 - Fill Only:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block2)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block2, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block2, 'fill/change')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/changeType:',
      engine.block.isScopeEnabled(block2, 'fill/changeType')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/crop:',
      engine.block.isScopeEnabled(block2, 'layer/crop')
    );

    // eslint-disable-next-line no-console
    console.log('\nBlock 3 - Disabled:');
    // eslint-disable-next-line no-console
    console.log(
      '  Placeholder enabled:',
      engine.block.isPlaceholderEnabled(block3)
    );
    // eslint-disable-next-line no-console
    console.log('  Scopes enabled:');
    // eslint-disable-next-line no-console
    console.log(
      '    - layer/move:',
      engine.block.isScopeEnabled(block3, 'layer/move')
    );
    // eslint-disable-next-line no-console
    console.log(
      '    - fill/change:',
      engine.block.isScopeEnabled(block3, 'fill/change')
    );

    // eslint-disable-next-line no-console
    console.log('\nPlaceholder configurations initialized successfully');
  }
}

export default Example;
