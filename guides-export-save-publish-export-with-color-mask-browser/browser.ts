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
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a single image with registration marks
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: pageWidth * 0.8, height: pageHeight * 0.8 }
    });
    engine.block.appendChild(page, imageBlock);

    // Center the image on the page
    const imageWidth = engine.block.getWidth(imageBlock);
    const imageHeight = engine.block.getHeight(imageBlock);
    engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

    // Add registration marks at the corners (pure red for demonstration)
    const markSize = 30;
    const imageX = engine.block.getPositionX(imageBlock);
    const imageY = engine.block.getPositionY(imageBlock);

    const markPositions = [
      { x: imageX - markSize - 10, y: imageY - markSize - 10 }, // Top-left
      { x: imageX + imageWidth + 10, y: imageY - markSize - 10 }, // Top-right
      { x: imageX - markSize - 10, y: imageY + imageHeight + 10 }, // Bottom-left
      { x: imageX + imageWidth + 10, y: imageY + imageHeight + 10 } // Bottom-right
    ];

    markPositions.forEach((pos) => {
      const mark = engine.block.create('//ly.img.ubq/graphic');
      engine.block.setShape(
        mark,
        engine.block.createShape('//ly.img.ubq/shape/rect')
      );
      const redFill = engine.block.createFill('//ly.img.ubq/fill/color');
      engine.block.setColor(redFill, 'fill/color/value', {
        r: 1.0,
        g: 0.0,
        b: 0.0,
        a: 1.0
      });
      engine.block.setFill(mark, redFill);
      engine.block.setWidth(mark, markSize);
      engine.block.setHeight(mark, markSize);
      engine.block.setPositionX(mark, pos.x);
      engine.block.setPositionY(mark, pos.y);
      engine.block.appendChild(page, mark);
    });

    // Override the default image export action to use color mask export
    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage();
      if (!currentPage) return;

      // Export with color mask - removes pure red pixels (registration marks)
      const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
        currentPage,
        1.0, // Red component
        0.0, // Green component
        0.0, // Blue component (RGB: pure red)
        { mimeType: 'image/png' }
      );

      // Download masked image using CE.SDK utils
      await cesdk.utils.downloadFile(maskedImage, 'image/png');

      // Download alpha mask
      await cesdk.utils.downloadFile(alphaMask, 'image/png');

      console.log('Color mask export completed:', {
        maskedSize: maskedImage.size,
        maskSize: alphaMask.size
      });
    });

    // Add export button to navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: ['ly.img.exportImage.navigationBar']
      }
    );

    // Log completion
    console.log('Export with Color Mask example loaded successfully');
    console.log(
      'Click the export button in the navigation bar to export with color mask'
    );
  }
}

export default Example;
