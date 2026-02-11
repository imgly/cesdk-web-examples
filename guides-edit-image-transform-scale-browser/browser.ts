import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-edit-image-transform-scale-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
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


    // Demo 1: Uniform Scaling - Scale from center anchor
    const scaledImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, scaledImage);
    engine.block.setPositionX(scaledImage, 50);
    engine.block.setPositionY(scaledImage, 100);

    // Scale uniformly to 150% from center anchor
    engine.block.scale(scaledImage, 1.5, 0.5, 0.5);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Uniform Scale');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 225);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 360);
    engine.block.appendChild(page, text1);

    // Demo 2: Non-Uniform Scaling - Stretch width only
    const stretchedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, stretchedImage);
    engine.block.setPositionX(stretchedImage, 300);
    engine.block.setPositionY(stretchedImage, 150);

    // Stretch width by 50% while keeping height
    engine.block.setWidthMode(stretchedImage, 'Absolute');
    const currentWidth = engine.block.getWidth(stretchedImage);
    engine.block.setWidth(stretchedImage, currentWidth * 1.5, true);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Non-Uniform');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 225);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 360);
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Image - Cannot be scaled
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 150, height: 150 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 575);
    engine.block.setPositionY(lockedImage, 150);

    // Lock transforms to prevent scaling
    engine.block.setTransformLocked(lockedImage, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 150);
    engine.block.setPositionX(text3, 575);
    engine.block.setPositionY(text3, 360);
    engine.block.appendChild(page, text3);

    // Scale with different anchor points
    // Top-left anchor (0, 0) - default
    // Center anchor (0.5, 0.5) - scales from center
    // Bottom-right anchor (1, 1) - scales from bottom-right corner
    const anchorX = 0.5;
    const anchorY = 0.5;
    const scaleFactor = 1.2;
    engine.block.scale(scaledImage, scaleFactor, anchorX, anchorY);

    // Restrict scaling through scopes
    engine.block.setScopeEnabled(lockedImage, 'layer/resize', false);

    // Select the scaled image to show the result
    engine.block.select(scaledImage);
  }
}

export default Example;
