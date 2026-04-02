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

    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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

    // Enable vector path editing feature
    cesdk.feature.enable('ly.img.shape.edit');

    await cesdk.actions.run('scene.create', {
      page: { width: 100, height: 100, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a graphic block with a star shape
    const graphic = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(graphic, starShape);

    const solidFill = engine.block.createFill('color');
    engine.block.setFill(graphic, solidFill);
    engine.block.setWidth(graphic, 60);
    engine.block.setHeight(graphic, 60);
    engine.block.appendChild(page, graphic);
    engine.block.setPositionX(graphic, 20);
    engine.block.setPositionY(graphic, 20);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the graphic block and enter vector edit mode.
    // This converts the shape to a vector path so you can
    // manipulate individual anchor points and curves.
    engine.block.select(graphic);
    engine.editor.setEditMode('Vector');

    // Move mode (default): select and drag anchor points.
    // All mode flags start as false — move mode is active
    // when none of the other modes are set.

    // Bend mode: drag path segments to pull out bezier handles.
    engine.editor.setVectorEditBendMode(true);
    engine.editor.getVectorEditBendMode(); // true

    // Add mode: click on a path segment to insert a new anchor point.
    engine.editor.setVectorEditBendMode(false);
    engine.editor.setVectorEditAddMode(true);
    engine.editor.getVectorEditAddMode(); // true

    // Delete mode: click an anchor point to remove it from the path.
    engine.editor.setVectorEditAddMode(false);
    engine.editor.setVectorEditDeleteMode(true);
    engine.editor.getVectorEditDeleteMode(); // true

    // Return to move mode by clearing all flags.
    engine.editor.setVectorEditDeleteMode(false);

    // Mirror mode controls how bezier handles behave when you
    // adjust one side of an anchor point.
    // 0 = None: handles move independently.
    // 1 = Angle & Length: handles mirror both angle and length.
    // 2 = Angle Only: handles mirror angle but keep their own length.
    if (engine.editor.hasSelectedVectorNode()) {
      engine.editor.setSelectedVectorNodeMirrorMode(1);
      engine.editor.getSelectedVectorNodeMirrorMode(); // 1

      // Toggle smooth/sharp for the selected node.
      engine.editor.toggleSelectedVectorNodeSmooth();
    }

    // Query whether any vector anchor node is currently selected.
    engine.editor.hasSelectedVectorNode();

    // Insert a new anchor point at the midpoint of the
    // selected segment (only works in add mode).
    engine.editor.setVectorEditAddMode(true);
    // engine.editor.addVectorNode();

    // Remove the currently selected anchor point from the path.
    // engine.editor.deleteVectorNode();
    engine.editor.setVectorEditAddMode(false);

    // Exit vector edit mode and return to the normal transform mode.
    engine.editor.setEditMode('Transform');
  }
}

export default Example;
