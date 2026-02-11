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
      page: { width: 450, height: 250, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // ===== Section 1: Using Convenience API =====
    // Create sticker using the convenient addImage() method
    const sticker = await engine.block.addImage(
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg'
    );

    // Set size and position (preserve aspect ratio)
    const naturalWidth = engine.block.getWidth(sticker);
    const naturalHeight = engine.block.getHeight(sticker);
    const scale = 80 / Math.max(naturalWidth, naturalHeight);
    engine.block.setWidth(sticker, naturalWidth * scale);
    engine.block.setHeight(sticker, naturalHeight * scale);
    engine.block.setPositionX(sticker, 95);
    engine.block.setPositionY(sticker, 85);

    // Prevent cropping and mark as sticker
    if (engine.block.supportsContentFillMode(sticker)) {
      engine.block.setContentFillMode(sticker, 'Contain');
    }
    engine.block.setKind(sticker, 'Sticker');

    // Add to scene
    engine.block.appendChild(page, sticker);

    // ===== Section 2: Manual Construction =====
    // Create sticker manually for fine-grained control
    const manualSticker = engine.block.create('graphic');

    // Set a shape (required for graphic blocks to be visible)
    engine.block.setShape(manualSticker, engine.block.createShape('rect'));

    // Create and apply image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_blush.svg'
    );
    engine.block.setFill(manualSticker, imageFill);

    // Set size and position (preserve aspect ratio)
    const manualWidth = engine.block.getWidth(manualSticker) || 100;
    const manualHeight = engine.block.getHeight(manualSticker) || 100;
    const manualScale = 80 / Math.max(manualWidth, manualHeight);
    engine.block.setWidth(manualSticker, manualWidth * manualScale);
    engine.block.setHeight(manualSticker, manualHeight * manualScale);
    engine.block.setPositionX(manualSticker, 275);
    engine.block.setPositionY(manualSticker, 85);

    // Prevent cropping and mark as sticker
    if (engine.block.supportsContentFillMode(manualSticker)) {
      engine.block.setContentFillMode(manualSticker, 'Contain');
    }
    engine.block.setKind(manualSticker, 'Sticker');

    // Add to scene
    engine.block.appendChild(page, manualSticker);
  }
}

export default Example;
