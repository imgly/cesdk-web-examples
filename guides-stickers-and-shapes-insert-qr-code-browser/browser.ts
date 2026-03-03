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
import { generateQRCodeDataURL } from './qr-utils';

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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    const qrSize = 200;

    // ===== Demonstration: QR Code as Image Fill =====
    // Generate QR code as data URL image with custom colors
    const qrImageUrl = await generateQRCodeDataURL('https://img.ly', {
      width: 256,
      color: { dark: '#1a5fb4', light: '#ffffff' }
    });

    // Create graphic block with rectangle shape and image fill
    const imageQrBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageQrBlock, rectShape);

    // Create image fill with QR code data URL
    const imageFill = engine.block.createFill('image');
    engine.block.setString(imageFill, 'fill/image/imageFileURI', qrImageUrl);
    engine.block.setFill(imageQrBlock, imageFill);

    // Set dimensions and position for image-based QR code
    engine.block.setWidth(imageQrBlock, qrSize);
    engine.block.setHeight(imageQrBlock, qrSize);
    engine.block.setPositionX(imageQrBlock, 300);
    engine.block.setPositionY(imageQrBlock, 200);

    // Add to page
    engine.block.appendChild(page, imageQrBlock);

    // Add label for the QR code
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Image Fill');
    engine.block.setFloat(textBlock, 'text/fontSize', 69);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(textBlock, 300);
    engine.block.setPositionX(textBlock, 250);
    engine.block.setPositionY(textBlock, 420);
    engine.block.appendChild(page, textBlock);

    // Zoom to fit all content
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
