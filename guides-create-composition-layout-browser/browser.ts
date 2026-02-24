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
    if (!cesdk) throw new Error('CE.SDK instance is required');

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

    // Create a scene with vertical stack layout
    // Pages arrange top-to-bottom automatically
    engine.scene.create('VerticalStack');

    // Get the stack container created with the scene
    const [stack] = engine.block.findByType('stack');

    // Create two pages that will stack vertically
    const page1 = engine.block.create('page');
    engine.block.setWidth(page1, 400);
    engine.block.setHeight(page1, 300);
    engine.block.appendChild(stack, page1);

    const page2 = engine.block.create('page');
    engine.block.setWidth(page2, 400);
    engine.block.setHeight(page2, 300);
    engine.block.appendChild(stack, page2);

    // Configure spacing between stacked pages
    engine.block.setFloat(stack, 'stack/spacing', 20);
    engine.block.setBool(stack, 'stack/spacingInScreenspace', true);

    // Add image content to page 1
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const block1 = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.setPositionX(block1, 25);
    engine.block.setPositionY(block1, 25);
    engine.block.appendChild(page1, block1);

    // Add a colored rectangle to page 2
    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, 350);
    engine.block.setHeight(block2, 250);
    engine.block.setPositionX(block2, 25);
    engine.block.setPositionY(block2, 25);
    const fill2 = engine.block.createFill('color');
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 0.3,
      g: 0.6,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(block2, fill2);
    engine.block.appendChild(page2, block2);

    // Switch to horizontal stack layout
    // Pages now arrange left-to-right
    engine.scene.setLayout('HorizontalStack');

    // Verify the layout type
    const currentLayout = engine.scene.getLayout();
    console.log('Current layout:', currentLayout);

    // Add a new page to the existing stack
    // The page automatically appears at the end
    const page3 = engine.block.create('page');
    engine.block.setWidth(page3, 400);
    engine.block.setHeight(page3, 300);
    engine.block.appendChild(stack, page3);

    // Add content to the new page
    const block3 = engine.block.create('graphic');
    const shape3 = engine.block.createShape('rect');
    engine.block.setShape(block3, shape3);
    engine.block.setWidth(block3, 350);
    engine.block.setHeight(block3, 250);
    engine.block.setPositionX(block3, 25);
    engine.block.setPositionY(block3, 25);
    const fill3 = engine.block.createFill('color');
    engine.block.setColor(fill3, 'fill/color/value', {
      r: 0.9,
      g: 0.5,
      b: 0.3,
      a: 1.0
    });
    engine.block.setFill(block3, fill3);
    engine.block.appendChild(page3, block3);

    // Reorder pages using insertChild
    // Move page3 to the first position
    engine.block.insertChild(stack, page3, 0);

    // Verify the new order
    const pageOrder = engine.block.getChildren(stack);
    console.log('Page order after reordering:', pageOrder);

    // Update spacing between stacked pages
    engine.block.setFloat(stack, 'stack/spacing', 40);

    // Verify the spacing value
    const updatedSpacing = engine.block.getFloat(stack, 'stack/spacing');
    console.log('Updated spacing:', updatedSpacing);

    // Zoom to show all pages in the stack
    await engine.scene.zoomToBlock(stack, { padding: 50 });
  }
}

export default Example;
