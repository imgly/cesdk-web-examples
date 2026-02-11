import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

interface CustomFeaturePluginConfig {
  ui?: {
    locations?: ('canvasMenu' | 'inspectorBar')[];
  };
}

const DEFAULT_CONFIG: CustomFeaturePluginConfig = {
  ui: {
    locations: []
  }
};

const CustomFeaturePlugin = (
  userConfig: CustomFeaturePluginConfig = {}
): EditorPlugin => {
  // Merge user config with defaults
  const config: CustomFeaturePluginConfig = {
    ...DEFAULT_CONFIG,
    ui: {
      ...DEFAULT_CONFIG.ui,
      ...userConfig.ui
    }
  };

  return {
    name: 'CustomFeaturePlugin',
    version: '1.0.0',

    async initialize({ cesdk, engine }: EditorPluginContext): Promise<void> {
      if (!cesdk) {
        console.log('Plugin initialized in engine-only mode');
        return;
      }

      console.log('CustomFeaturePlugin initialized');

      // Load default assets and create a design scene
      // eslint-disable-next-line deprecation/deprecation
      await cesdk.addDefaultAssetSources();
      // eslint-disable-next-line deprecation/deprecation
      await cesdk.addDemoAssetSources({
        sceneMode: 'Design',
        withUploadAssetSources: true
      });
      await cesdk.actions.run('scene.create', {
        page: { width: 800, height: 600, unit: 'Pixel' }
      });

      const page = engine.block.findByType('page')[0];
      if (page) {
        // Create gradient background fill
        const gradientFill = engine.block.createFill('gradient/linear');
        engine.block.setGradientColorStops(
          gradientFill,
          'fill/gradient/colors',
          [
            { color: { r: 0.1, g: 0.1, b: 0.2, a: 1.0 }, stop: 0 },
            { color: { r: 0.3, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
            { color: { r: 0.1, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
          ]
        );
        engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/startPointX',
          0
        );
        engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/startPointY',
          0
        );
        engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/endPointX',
          1
        );
        engine.block.setFloat(
          gradientFill,
          'fill/gradient/linear/endPointY',
          1
        );
        engine.block.setFill(page, gradientFill);

        // Create centered "IMG.LY" text
        const textBlock = engine.block.create('text');
        engine.block.replaceText(textBlock, 'IMG.LY');
        engine.block.setTextFontSize(textBlock, 80);
        engine.block.setTextColor(textBlock, {
          r: 1.0,
          g: 1.0,
          b: 1.0,
          a: 1.0
        });
        engine.block.setWidthMode(textBlock, 'Auto');
        engine.block.setHeightMode(textBlock, 'Auto');
        engine.block.appendChild(page, textBlock);

        // Center the text on the page
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        const textWidth = engine.block.getFrameWidth(textBlock);
        const textHeight = engine.block.getFrameHeight(textBlock);
        engine.block.setPositionX(textBlock, (pageWidth - textWidth) / 2);
        engine.block.setPositionY(textBlock, (pageHeight - textHeight) / 2);

        // Select the text block to show the canvas menu
        engine.block.select(textBlock);

        engine.block
          .findAllSelected()
          .forEach((b) => engine.block.setSelected(b, false));
        const currentPage = engine.scene.getCurrentPage();
        if (currentPage !== null) {
          engine.block.setSelected(currentPage, true);
        }
      }

      // Register a custom button component
      cesdk.ui.registerComponent(
        'customFeaturePlugin.action.canvasMenu',
        (context) => {
          context.builder.Button('custom-action', {
            label: 'Custom Action',
            icon: '@imgly/Apps',
            onClick: () => {
              cesdk.ui.showNotification({
                message: 'Custom action triggered!',
                type: 'success',
                duration: 'short'
              });
              console.log('Custom action executed');
            }
          });
        }
      );

      // Only add to canvas menu if configured
      const locations = config.ui?.locations ?? [];
      if (locations.includes('canvasMenu')) {
        const currentOrder = cesdk.ui.getComponentOrder({
          in: 'ly.img.canvas.menu'
        });
        cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
          'customFeaturePlugin.action.canvasMenu',
          ...currentOrder
        ]);
        console.log('Custom action added to canvas menu');
      }

      // Subscribe to block events for demonstration
      const unsubscribe = engine.event.subscribe([], (events) => {
        events.forEach((event) => {
          if (event.type === 'Created') {
            console.log(`Block created: ${event.block}`);
          }
        });
      });

      // Store unsubscribe for potential cleanup
      (window as any).unsubscribeCustomFeature = unsubscribe;
    }
  };
};

export default CustomFeaturePlugin;
