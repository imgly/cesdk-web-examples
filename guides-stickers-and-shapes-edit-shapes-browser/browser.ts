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
      page: { width: 100, height: 100, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const graphic = engine.block.create('graphic');
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);
    engine.block.setWidth(graphic, 100);
    engine.block.setHeight(graphic, 100);
    engine.block.appendChild(page, graphic);
    engine.block.setPositionX(graphic, 0);
    engine.block.setPositionY(graphic, 0);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    engine.block.supportsShape(graphic); // Returns true
    const text = engine.block.create('text');
    engine.block.supportsShape(text); // Returns false

    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    const shape = engine.block.getShape(graphic);
    const shapeType = engine.block.getType(shape);

    const starShape = engine.block.createShape('star');
    engine.block.destroy(engine.block.getShape(graphic));
    engine.block.setShape(graphic, starShape);
    /* The following line would also destroy the currently attached starShape */
    // engine.block.destroy(graphic);

    const allShapeProperties = engine.block.findAllProperties(starShape);
    engine.block.setInt(starShape, 'shape/star/points', 5);
  }
}

export default Example;
