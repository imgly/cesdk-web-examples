import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';

/**
 * CE.SDK Plugin: Lock Content Guide
 *
 * Demonstrates how to use scopes to lock design elements and control what users can modify.
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

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

    // Get all available scopes
    const allScopes = engine.editor.findAllScopes();
    // eslint-disable-next-line no-console
    console.log('Available scopes:', allScopes);

    // Step 1: Lock everything by setting all global scopes to 'Deny'
    for (const scope of allScopes) {
      engine.editor.setGlobalScope(scope, 'Deny');
    }
    // eslint-disable-next-line no-console
    console.log('All scopes locked globally');

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
    // eslint-disable-next-line no-console
    console.log(
      'Text editing enabled for:',
      engine.block.getName(editableText)
    );

    // Step 3: Allow image replacement on specific blocks
    // Set fill/change scope to 'Defer'
    engine.editor.setGlobalScope('fill/change', 'Defer');

    // Enable image replacement on the replaceable image block
    engine.block.setScopeEnabled(replaceableImage, 'fill/change', true);
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log(
      'Position adjustment enabled for:',
      engine.block.getName(movableShape)
    );

    // Step 5: Verify the effective permissions
    this.logPermissions(engine, 'Locked Image', lockedImage);
    this.logPermissions(engine, 'Editable Text', editableText);
    this.logPermissions(engine, 'Replaceable Image', replaceableImage);
    this.logPermissions(engine, 'Movable Shape', movableShape);

    // Zoom to fit the page
    await engine.scene.zoomToBlock(page, {
      padding: { left: 40, top: 40, right: 40, bottom: 40 }
    });
  }

  private logPermissions(
    engine: CreativeEngine,
    name: string,
    blockId: number
  ): void {
    const canMove = engine.block.isAllowedByScope(blockId, 'layer/move');
    const canResize = engine.block.isAllowedByScope(blockId, 'layer/resize');
    const canEditText = engine.block.isAllowedByScope(blockId, 'text/edit');
    const canChangeFill = engine.block.isAllowedByScope(blockId, 'fill/change');
    const canDelete = engine.block.isAllowedByScope(
      blockId,
      'lifecycle/destroy'
    );

    // eslint-disable-next-line no-console
    console.log(`Permissions for "${name}":`);
    // eslint-disable-next-line no-console
    console.log(`  - Move: ${canMove}`);
    // eslint-disable-next-line no-console
    console.log(`  - Resize: ${canResize}`);
    // eslint-disable-next-line no-console
    console.log(`  - Edit text: ${canEditText}`);
    // eslint-disable-next-line no-console
    console.log(`  - Change fill: ${canChangeFill}`);
    // eslint-disable-next-line no-console
    console.log(`  - Delete: ${canDelete}`);
  }
}

export default Example;
