import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources for editing
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // ========================================
    // Create an Empty Scene
    // ========================================
    // Create a new empty scene with a page of specific dimensions
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    // Find the page that was automatically created
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // ========================================
    // Enable Auto-Fit Zoom
    // ========================================
    // Enable auto-fit zoom to keep the page visible when resizing
    // This continuously adjusts the zoom level to fit the page horizontally
    engine.scene.zoomToBlock(page);
    engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);
  }
}

export default Example;
