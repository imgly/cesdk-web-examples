import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Blend Modes Guide
 *
 * This example demonstrates:
 * - Checking if a block supports blend modes
 * - Setting blend modes on overlay layers
 * - Getting the current blend mode of a block
 * - Working with opacity values
 * - Available blend mode values
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create a design scene
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

    const page = engine.block.findByType('page')[0];

    // Grid configuration: 3 columns x 2 rows
    const cols = 3;
    const rows = 2;
    const cellWidth = 280;
    const cellHeight = 210;
    const padding = 20;
    const pageWidth = cols * cellWidth + (cols + 1) * padding;
    const pageHeight = rows * cellHeight + (rows + 1) * padding;

    // Set page dimensions
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Base and overlay image URLs
    const baseImageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const overlayImageUrl = 'https://img.ly/static/ubq_samples/sample_2.jpg';

    // Six commonly used blend modes to demonstrate
    const blendModes: Array<
      'Multiply' | 'Screen' | 'Overlay' | 'Darken' | 'Lighten' | 'ColorBurn'
    > = ['Multiply', 'Screen', 'Overlay', 'Darken', 'Lighten', 'ColorBurn'];

    // Create 6 image pairs in a grid layout
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const x = padding + col * (cellWidth + padding);
        const y = padding + row * (cellHeight + padding);

        // Create a background image block as the base layer
        const backgroundBlock = engine.block.create('graphic');
        const backgroundShape = engine.block.createShape('rect');
        engine.block.setShape(backgroundBlock, backgroundShape);
        engine.block.setWidth(backgroundBlock, cellWidth);
        engine.block.setHeight(backgroundBlock, cellHeight);
        engine.block.setPositionX(backgroundBlock, x);
        engine.block.setPositionY(backgroundBlock, y);

        // Set the image fill for the background
        const backgroundFill = engine.block.createFill('image');
        engine.block.setString(
          backgroundFill,
          'fill/image/imageFileURI',
          baseImageUrl
        );
        engine.block.setFill(backgroundBlock, backgroundFill);
        engine.block.setContentFillMode(backgroundBlock, 'Cover');
        engine.block.appendChild(page, backgroundBlock);

        // Create a second image block on top for blending
        const overlayBlock = engine.block.create('graphic');
        const overlayShape = engine.block.createShape('rect');
        engine.block.setShape(overlayBlock, overlayShape);
        engine.block.setWidth(overlayBlock, cellWidth);
        engine.block.setHeight(overlayBlock, cellHeight);
        engine.block.setPositionX(overlayBlock, x);
        engine.block.setPositionY(overlayBlock, y);

        // Set a different image fill for the overlay
        const overlayFill = engine.block.createFill('image');
        engine.block.setString(
          overlayFill,
          'fill/image/imageFileURI',
          overlayImageUrl
        );
        engine.block.setFill(overlayBlock, overlayFill);
        engine.block.setContentFillMode(overlayBlock, 'Cover');
        engine.block.appendChild(page, overlayBlock);

        // Check if the block supports blend modes before applying
        if (engine.block.supportsBlendMode(overlayBlock)) {

          // Apply a different blend mode to each overlay
          const blendMode = blendModes[index];
          engine.block.setBlendMode(overlayBlock, blendMode);

          // Retrieve and log the current blend mode
          const currentMode = engine.block.getBlendMode(overlayBlock);
          // eslint-disable-next-line no-console
          console.log(`Cell ${index + 1} blend mode:`, currentMode);
        }

        // Check if the block supports opacity
        if (engine.block.supportsOpacity(overlayBlock)) {
          // Set the opacity to 80% for clear visibility
          engine.block.setOpacity(overlayBlock, 0.8);
        }

        // Retrieve and log the opacity value
        const opacity = engine.block.getOpacity(overlayBlock);
        // eslint-disable-next-line no-console
        console.log(`Cell ${index + 1} opacity:`, opacity);
      }
    }

    // Zoom to fit the composition
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }
}

export default Example;
