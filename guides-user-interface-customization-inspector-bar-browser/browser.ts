import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

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

    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.42, g: 0.22, b: 0.6, a: 1 }, stop: 0 },
      { color: { r: 0.58, g: 0.35, b: 0.75, a: 1 }, stop: 0.5 },
      { color: { r: 0.35, g: 0.55, b: 0.85, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create a text block for demonstrating text-specific inspector controls
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Inspector Bar\n\nimg.ly');
    engine.block.setWidth(titleText, pageWidth * 0.8);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, pageWidth * 0.1);
    engine.block.setPositionY(titleText, pageHeight * 0.25);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 24);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });

    // Deselect all blocks for clean hero image
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(titleText);

    // Switch between default and advanced view modes
    // 'default' shows the inspector bar above the canvas
    // 'advanced' shows the full inspector panel to the side
    cesdk.ui.setView('default');

    // Set a custom inspector bar order for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar',
        'ly.img.text.alignHorizontal.inspectorBar',
        'ly.img.separator',
        'ly.img.fill.inspectorBar',
        'ly.img.spacer',
        'ly.img.inspectorToggle.inspectorBar'
      ]
    );

    // Set a custom inspector bar order for Crop edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Crop' } },
      ['ly.img.cropControls.inspectorBar']
    );

    // Set a simplified Transform mode order with grouped controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
      'ly.img.spacer',
      'ly.img.text.typeFace.inspectorBar',
      'ly.img.text.bold.inspectorBar',
      'ly.img.text.italic.inspectorBar',
      'ly.img.text.fontSize.inspectorBar',
      'ly.img.text.alignHorizontal.inspectorBar',
      'ly.img.separator',
      'ly.img.fill.inspectorBar',
      'ly.img.stroke.inspectorBar',
      'ly.img.crop.inspectorBar',
      'ly.img.separator',
      'ly.img.filter.inspectorBar',
      'ly.img.effect.inspectorBar',
      'ly.img.blur.inspectorBar',
      'ly.img.adjustment.inspectorBar',
      'ly.img.separator',
      'ly.img.shadow.inspectorBar',
      'ly.img.opacityOptions.inspectorBar',
      'ly.img.position.inspectorBar',
      'ly.img.spacer',
      'ly.img.separator',
      'ly.img.inspectorToggle.inspectorBar'
    ]);

    // Retrieve and log the current inspector bar order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.inspector.bar'
    });
    console.log('Current inspector bar order:', currentOrder);
  }
}

export default Example;
