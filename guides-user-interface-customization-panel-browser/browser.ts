import type {
  EditorPlugin,
  EditorPluginContext,
  PanelPosition
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Panel Customization Example
 *
 * This example demonstrates how to use CE.SDK's Panel API to:
 * - Show and hide panels programmatically
 * - Position panels (left/right)
 * - Make panels float or dock
 * - Check panel state
 * - Find panels by criteria
 * - Configure panel payloads
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable panel features through Feature API
    cesdk.feature.enable('ly.img.inspector', () => true);
    cesdk.feature.enable('ly.img.library.panel', () => true);
    cesdk.feature.enable('ly.img.settings', () => true);

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Configure default panel positioning
    cesdk.ui.setPanelPosition(
      '//ly.img.panel/inspector',
      'left' as PanelPosition
    );
    cesdk.ui.setPanelFloating('//ly.img.panel/inspector', false);
    cesdk.ui.setPanelPosition(
      '//ly.img.panel/assetLibrary',
      'left' as PanelPosition
    );

    // Check if a panel is open before opening
    if (!cesdk.ui.isPanelOpen('//ly.img.panel/inspector')) {
      console.log('Inspector is not open yet');
    }

    // Open inspector panel with default settings
    cesdk.ui.openPanel('//ly.img.panel/inspector');

    // Add an image to demonstrate replace library functionality
    const image = await engine.asset.defaultApplyAsset({
      id: 'ly.img.cesdk.images.samples/sample.1',
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.image/images/sample_1.jpg',
        width: 2500,
        height: 1667
      }
    });

    if (image) {
      // Position the image in the center of the page
      const pageWidth = engine.block.getWidth(page);
      const pageHeight = engine.block.getHeight(page);
      const imageWidth = engine.block.getWidth(image);
      const imageHeight = engine.block.getHeight(image);

      engine.block.setPositionX(image, (pageWidth - imageWidth) / 2);
      engine.block.setPositionY(image, (pageHeight - imageHeight) / 2);

      // Select the image
      engine.block.setSelected(image, true);

      // Open replace library with custom options
      // This panel will float and be positioned on the right
      cesdk.ui.openPanel('//ly.img.panel/assetLibrary.replace', {
        position: 'right' as PanelPosition,
        floating: true,
        closableByUser: true
      });

      // Find all currently open panels
      const openPanels = cesdk.ui.findAllPanels({ open: true });
      console.log('Currently open panels:', openPanels);

      // Find all panels on the left
      const leftPanels = cesdk.ui.findAllPanels({
        position: 'left' as PanelPosition
      });
      console.log('Panels on the left:', leftPanels);

      // Get panel position and floating state
      const inspectorPosition = cesdk.ui.getPanelPosition(
        '//ly.img.panel/inspector'
      );
      const inspectorFloating = cesdk.ui.getPanelFloating(
        '//ly.img.panel/inspector'
      );
      console.log(
        `Inspector is on the ${inspectorPosition} side, floating: ${inspectorFloating}`
      );

      // Demonstrate responsive panel behavior
      const updatePanelLayout = () => {
        const isNarrowViewport = window.innerWidth < 768;

        // Float panels on narrow viewports
        cesdk.ui.setPanelFloating('//ly.img.panel/inspector', isNarrowViewport);

        // Adjust positioning based on available space
        if (!isNarrowViewport && window.innerWidth > 1200) {
          cesdk.ui.setPanelPosition(
            '//ly.img.panel/inspector',
            'right' as PanelPosition
          );
        } else if (!isNarrowViewport) {
          cesdk.ui.setPanelPosition(
            '//ly.img.panel/inspector',
            'left' as PanelPosition
          );
        }
      };

      // Apply responsive layout
      updatePanelLayout();

      // Update on window resize
      window.addEventListener('resize', updatePanelLayout);

      if (cesdk.ui.isPanelOpen('//ly.img.panel/assetLibrary.replace')) {
        cesdk.ui.closePanel('//ly.img.panel/assetLibrary.replace');
      }

      cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
        payload: {
          title: 'Custom Media Library',
          entries: ['ly.img.image', 'ly.img.video', 'ly.img.upload']
        }
      });

      // Example: Close all ly.img panels using wildcard
      // Uncomment to test:
      // setTimeout(() => {
      //   console.log('Closing all ly.img panels...');
      //   cesdk.ui.closePanel('//ly.img.*');
      // }, 10000);
    }
  }
}

export default Example;
