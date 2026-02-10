import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // ===== Hide Elements Examples =====
    // Configure UI visibility before loading assets and creating scene
    // Show only navigation bar and inspector bar, hide everything else

    // Hide canvas bar and canvas menu using Feature API
    cesdk.feature.disable(['ly.img.canvas.bar', 'ly.img.canvas.menu']);

    // Hide the entire dock using Feature API
    cesdk.feature.disable('ly.img.dock');

    // Hide UI elements using ordering APIs (alternative method)
    // Setting empty array removes all components
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, []);

    // Close all panels using wildcard pattern
    cesdk.ui.closePanel('//ly.img.panel/*');

    // Check if panels are open
    const inspectorPanelId = '//ly.img.panel/inspector';
    const isInspectorOpen = cesdk.ui.isPanelOpen(inspectorPanelId);
    console.log('Inspector panel open:', isInspectorOpen);

    // Find all panels
    const allPanels = cesdk.ui.findAllPanels();
    console.log('All panels:', allPanels);

    // Using glob patterns to control multiple features
    const navigationFeatures = cesdk.feature.list({
      matcher: 'ly.img.navigation.*'
    });
    console.log('Navigation features:', navigationFeatures);

    // Disable all navigation features at once using wildcard pattern
    // cesdk.feature.disable('ly.img.navigation.*');

    // Check if features are enabled
    const isDockEnabled = cesdk.feature.isEnabled('ly.img.dock');
    const isNavBarEnabled = cesdk.feature.isEnabled('ly.img.navigation.bar');
    console.log('Dock enabled:', isDockEnabled);
    console.log('Navigation bar enabled:', isNavBarEnabled);

    // Hide notification toasts
    cesdk.feature.disable('ly.img.notifications');
    // Or hide specific notification types:
    // cesdk.feature.disable('ly.img.notifications.undo');
    // cesdk.feature.disable('ly.img.notifications.redo');

    // ===== Load Assets and Create Scene =====
    // Now that UI is configured, load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Add a single image to the canvas
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Center and fit the image on the page
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const imageWidth = engine.block.getWidth(imageBlock);
    const imageHeight = engine.block.getHeight(imageBlock);

    // Calculate scale to fit image within page
    const scaleX = pageWidth / imageWidth;
    const scaleY = pageHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of page size

    // Apply scale and center
    engine.block.setWidth(imageBlock, imageWidth * scale);
    engine.block.setHeight(imageBlock, imageHeight * scale);

    const scaledWidth = engine.block.getWidth(imageBlock);
    const scaledHeight = engine.block.getHeight(imageBlock);
    engine.block.setPositionX(imageBlock, (pageWidth - scaledWidth) / 2);
    engine.block.setPositionY(imageBlock, (pageHeight - scaledHeight) / 2);

    // Select the image to show the inspector
    engine.block.setSelected(imageBlock, true);

    console.log('Hide elements example loaded successfully!');
  }
}

export default Example;
