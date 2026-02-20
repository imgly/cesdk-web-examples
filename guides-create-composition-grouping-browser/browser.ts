import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Group and Ungroup Objects Guide
 *
 * This example demonstrates:
 * - Creating multiple graphic blocks
 * - Checking if blocks can be grouped
 * - Grouping blocks together
 * - Navigating into and out of groups
 * - Ungrouping blocks
 * - Finding and inspecting groups
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


    const engine = cesdk.engine;

    // Create a design scene and get the page
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Create a graphic block with a colored rectangle shape
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, 120);
    engine.block.setHeight(block1, 120);
    engine.block.setPositionX(block1, 200);
    engine.block.setPositionY(block1, 240);
    const fill1 = engine.block.createFill('color');
    engine.block.setColor(fill1, 'fill/color/value', {
      r: 0.4,
      g: 0.6,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(block1, fill1);
    engine.block.appendChild(page, block1);

    // Create two more blocks for grouping
    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, 120);
    engine.block.setHeight(block2, 120);
    engine.block.setPositionX(block2, 340);
    engine.block.setPositionY(block2, 240);
    const fill2 = engine.block.createFill('color');
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 0.9,
      g: 0.5,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(block2, fill2);
    engine.block.appendChild(page, block2);

    const block3 = engine.block.create('graphic');
    const shape3 = engine.block.createShape('rect');
    engine.block.setShape(block3, shape3);
    engine.block.setWidth(block3, 120);
    engine.block.setHeight(block3, 120);
    engine.block.setPositionX(block3, 480);
    engine.block.setPositionY(block3, 240);
    const fill3 = engine.block.createFill('color');
    engine.block.setColor(fill3, 'fill/color/value', {
      r: 0.5,
      g: 0.8,
      b: 0.5,
      a: 1.0
    });
    engine.block.setFill(block3, fill3);
    engine.block.appendChild(page, block3);

    // Check if the blocks can be grouped together
    const canGroup = engine.block.isGroupable([block1, block2, block3]);
    console.log('Blocks can be grouped:', canGroup);

    // Group the blocks together
    if (canGroup) {
      const groupId = engine.block.group([block1, block2, block3]);
      console.log('Created group with ID:', groupId);

      // Select the group to show it in the UI
      engine.block.setSelected(groupId, true);

      // Enter the group to select individual members
      engine.block.enterGroup(groupId);

      // Select a specific member within the group
      engine.block.setSelected(block2, true);
      console.log('Selected member inside group');

      // Exit the group to return selection to the parent group
      engine.block.exitGroup(block2);
      console.log('Exited group, group is now selected');

      // Find all groups in the scene
      const allGroups = engine.block.findByType('group');
      console.log('Number of groups in scene:', allGroups.length);

      // Check the type of the group block
      const groupType = engine.block.getType(groupId);
      console.log('Group block type:', groupType);

      // Get the members of the group
      const members = engine.block.getChildren(groupId);
      console.log('Group has', members.length, 'members');

      // Ungroup the blocks to make them independent again
      engine.block.ungroup(groupId);
      console.log('Ungrouped blocks');

      // Verify blocks are no longer in a group
      const groupsAfterUngroup = engine.block.findByType('group');
      console.log('Groups after ungrouping:', groupsAfterUngroup.length);

      // Re-group for the final display
      const finalGroup = engine.block.group([block1, block2, block3]);
      engine.block.setSelected(finalGroup, true);
    }

    // Enable auto-fit zoom to keep the page centered
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
