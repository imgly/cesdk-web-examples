import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { generateQRCodeDataURL } from './qr-utils';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
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
