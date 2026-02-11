import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

class BlurPlugin implements EditorPlugin {
  name = 'BlurPlugin';

  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Initialize scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });

    const page = engine.block.findByType('page')[0];

    // Get page dimensions to position content correctly
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    if (!engine.block.supportsBlur(page)) {
      console.log('Block does not support blur');
      return;
    }

    // Create an image block
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );

    // Position image to fill the page
    engine.block.setWidth(imageBlock, pageWidth);
    engine.block.setHeight(imageBlock, pageHeight);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    engine.block.appendChild(page, imageBlock);

    const blur = engine.block.createBlur('//ly.img.ubq/blur/radial');

    engine.block.setFloat(blur, 'blur/radial/blurRadius', 40);
    engine.block.setFloat(blur, 'blur/radial/radius', 100);
    engine.block.setFloat(blur, 'blur/radial/gradientRadius', 80);
    engine.block.setFloat(blur, 'blur/radial/x', 0.5);
    engine.block.setFloat(blur, 'blur/radial/y', 0.5);

    engine.block.setBlur(imageBlock, blur);
    engine.block.setBlurEnabled(imageBlock, true);

    const appliedBlur = engine.block.getBlur(imageBlock);
    const isEnabled = engine.block.isBlurEnabled(imageBlock);
    const blurType = engine.block.getType(appliedBlur);
    console.log('Blur type:', blurType, 'Enabled:', isEnabled);

    engine.block.setBlurEnabled(imageBlock, false);
    const nowEnabled = engine.block.isBlurEnabled(imageBlock);
    console.log('Blur now enabled:', nowEnabled);
    engine.block.setBlurEnabled(imageBlock, true);
  }
}

export default BlurPlugin;
