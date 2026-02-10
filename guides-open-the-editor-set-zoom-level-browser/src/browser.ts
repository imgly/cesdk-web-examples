import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from '../package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const page = engine.block.findByType('page')[0];

    // Set a specific zoom level (value 0.15 = 15%, 1.0 = 100%)
    engine.scene.setZoomLevel(0.15);

    // Enable auto-fit to keep content visible within the viewport
    // Parameters: block, fitMode, paddingTop, paddingRight, paddingBottom, paddingLeft
    engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);

    // Configure navigation bar with custom zoom buttons
    // This replaces the default zoom controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-15',
        label: 'Zoom 15%',
        icon: '@imgly/ZoomOut',
        onClick: () => {
          engine.scene.setZoomLevel(0.15);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-42',
        label: 'Zoom 42%',
        icon: '@imgly/Zoom',
        onClick: () => {
          engine.scene.setZoomLevel(0.42);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-90',
        label: 'Zoom 90%',
        icon: '@imgly/ZoomIn',
        onClick: () => {
          engine.scene.setZoomLevel(0.9);
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'zoom-auto-fit',
        label: 'Auto-Fit',
        icon: '@imgly/Fit',
        onClick: () => {
          engine.scene.enableZoomAutoFit(page, 'Both', 20, 20, 20, 20);
        }
      }
    ]);

    // Zoom to show a specific block with smooth animation
    await engine.scene.zoomToBlock(page, {
      padding: 40,
      animate: { duration: 0.3, easing: 'EaseOut' }
    });
  }
}

export default Example;
