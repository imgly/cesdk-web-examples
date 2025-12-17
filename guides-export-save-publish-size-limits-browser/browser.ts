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
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions to match image display size for safe export
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Add export image action to navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportImage.navigationBar']
    });

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // ===== Section 1: Reading Current maxImageSize =====
    // Get the current maxImageSize setting
    const currentMaxSize = engine.editor.getSetting('maxImageSize');
    console.log('Current maxImageSize:', currentMaxSize);
    // Default is 4096 pixels

    // ===== Section 2: Setting Different maxImageSize Values =====
    // Configure maxImageSize for different use cases
    // This must be set BEFORE loading images to ensure they're downscaled

    // Low memory devices (mobile, tablets) - use 2048 for safety
    engine.editor.setSetting('maxImageSize', 2048);

    // High quality (professional workflows, desktop)
    // engine.editor.setSetting('maxImageSize', 8192);

    console.log(
      'Updated maxImageSize:',
      engine.editor.getSetting('maxImageSize')
    );

    // ===== Section 3: Observing Settings Changes =====
    // Subscribe to settings changes to update UI when maxImageSize changes
    engine.editor.onSettingsChanged(() => {
      const newMaxSize = engine.editor.getSetting('maxImageSize');
      console.log('maxImageSize changed to:', newMaxSize);
      // In a real app, update UI here to reflect the new setting
    });

    // The subscription returns an unsubscribe function if you need to clean up later
    // const unsubscribe = engine.editor.onSettingsChanged(() => { ... });
    // unsubscribe(); // Call when no longer needed

    // ===== Section 4: GPU Capability Detection (Web) =====
    // Query GPU max texture size to understand export limits
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      console.log('GPU Max Texture Size:', maxTextureSize);
      console.log(
        'Safe export dimensions: up to',
        maxTextureSize,
        '×',
        maxTextureSize
      );

      // Most modern GPUs support 4096×4096 to 16384×16384
      // Safe baseline is 4096×4096 for universal compatibility
    }

    // ===== Section 5: Pre-Export Size Validation =====
    // Calculate actual export dimensions including all content
    // Get bounding box of all content to check actual export size
    const allBlocks = engine.block.findByType('//ly.img.ubq/graphic');
    let maxRight = 0;
    let maxBottom = 0;

    allBlocks.forEach((blockId) => {
      const x = engine.block.getPositionX(blockId);
      const y = engine.block.getPositionY(blockId);
      const width = engine.block.getWidth(blockId);
      const height = engine.block.getHeight(blockId);
      maxRight = Math.max(maxRight, x + width);
      maxBottom = Math.max(maxBottom, y + height);
    });

    const exportWidth = Math.max(engine.block.getWidth(page), maxRight);
    const exportHeight = Math.max(engine.block.getHeight(page), maxBottom);

    console.log('Export dimensions:', exportWidth, '×', exportHeight);

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      // Use conservative limit (50% of max) for actual VRAM availability
      const safeTextureSize = Math.floor(maxTextureSize * 0.5);

      if (exportWidth > safeTextureSize || exportHeight > safeTextureSize) {
        cesdk.ui.showNotification({
          type: 'warning',
          message: `Export dimensions (${Math.round(exportWidth)}×${Math.round(exportHeight)}) exceed safe GPU limit (${safeTextureSize}×${safeTextureSize})`
        });
      } else {
        cesdk.ui.showNotification({
          type: 'success',
          message: 'Export dimensions are within safe limits'
        });
      }
    }

    // ===== Section 6: Handling Export Errors =====
    // Demonstrate proper error handling for size-related export failures
    try {
      // Example export operation (not actually exporting in this demo)
      // const blob = await engine.block.export(page, 'image/png');

      // If export fails, catch and handle the error
      console.log('Export would proceed here with proper error handling');
    } catch (error) {
      console.error('Export failed:', error);

      // Check if error is size-related
      if (
        error instanceof Error &&
        (error.message.includes('texture') ||
          error.message.includes('size') ||
          error.message.includes('memory'))
      ) {
        console.error('Size-related export error detected');
        console.error('Suggested remediation:');
        console.error('1. Reduce output dimensions');
        console.error('2. Decrease maxImageSize setting');
        console.error('3. Use export compression options');
      }
    }

    // Add an image to the page for demonstration
    // Note: NOT specifying size here - let maxImageSize control the texture loading
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Fit image to page dimensions
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);

    // Position image to fill the page (already matches page dimensions)
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Zoom to fit the content
    engine.scene.zoomToBlock(page, { padding: 40 });

    // Display information in console
    console.log('=== Size Limits Configuration Summary ===');
    console.log(
      'Current maxImageSize:',
      engine.editor.getSetting('maxImageSize')
    );
    console.log(
      'Page dimensions:',
      engine.block.getWidth(page),
      '×',
      engine.block.getHeight(page)
    );
    console.log(
      'Image dimensions:',
      engine.block.getWidth(imageBlock),
      '×',
      engine.block.getHeight(imageBlock)
    );

    if (gl) {
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      console.log('GPU max texture size:', maxTextureSize);
    }
  }
}

export default Example;
