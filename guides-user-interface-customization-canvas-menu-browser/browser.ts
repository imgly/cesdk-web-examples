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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a text block to demonstrate text edit mode menu
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(
      titleText,
      'Canvas Menu\n\nRight-click or select to see the menu'
    );
    engine.block.setWidth(titleText, pageWidth * 0.7);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, pageWidth * 0.15);
    engine.block.setPositionY(titleText, pageHeight * 0.2);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 22);

    // Create a shape block to demonstrate Transform mode menu
    const rect = engine.block.create('graphic');
    engine.block.appendChild(page, rect);
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rect, rectShape);
    engine.block.setWidth(rect, pageWidth * 0.3);
    engine.block.setHeight(rect, pageHeight * 0.2);
    engine.block.setPositionX(rect, pageWidth * 0.35);
    engine.block.setPositionY(rect, pageHeight * 0.6);
    const rectFill = engine.block.createFill('color');
    engine.block.setFill(rect, rectFill);
    engine.block.setColor(rectFill, 'fill/color/value', {
      r: 0.2,
      g: 0.5,
      b: 0.9,
      a: 1
    });

    // Select the shape so the canvas menu is visible
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(rect);

    // Hide the canvas menu
    cesdk.feature.disable('ly.img.canvas.menu');

    // Show the canvas menu (default)
    cesdk.feature.enable('ly.img.canvas.menu');

    // Set a custom canvas menu for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
      [
        'ly.img.text.color.canvasMenu',
        'ly.img.separator',
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.text.variables.canvasMenu'
      ]
    );

    // Set a custom canvas menu for Transform mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
      [
        'ly.img.text.edit.canvasMenu',
        'ly.img.replace.canvasMenu',
        'ly.img.separator',
        'ly.img.bringForward.canvasMenu',
        'ly.img.sendBackward.canvasMenu',
        'ly.img.separator',
        'ly.img.duplicate.canvasMenu',
        'ly.img.delete.canvasMenu',
        'ly.img.separator',
        'ly.img.options.canvasMenu'
      ]
    );

    // Add a custom action button to the canvas menu
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.menu', after: 'ly.img.duplicate.canvasMenu' },
      {
        id: 'ly.img.action.canvasMenu',
        key: 'copy-style',
        label: 'Copy Style',
        icon: '@imgly/Copy',
        onClick: () => {
          const selected = engine.block.findAllSelected()[0];
          if (selected != null) {
            console.log('Copying style from block:', selected);
          }
        }
      }
    );

    // Configure the options submenu children using updateOrderComponent
    // This modifies only the children of an existing dropdown without replacing the entire menu
    cesdk.ui.updateOrderComponent(
      { in: 'ly.img.canvas.menu', match: { id: 'ly.img.options.canvasMenu' } },
      {
        children: [
          'ly.img.flipX.canvasMenu',
          'ly.img.flipY.canvasMenu',
          'ly.img.separator',
          'ly.img.copy.canvasMenu',
          'ly.img.paste.canvasMenu'
        ]
      }
    );

    // Retrieve and log the current canvas menu order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.menu'
    });
    console.log('Current canvas menu order:', currentOrder);
  }
}

export default Example;
