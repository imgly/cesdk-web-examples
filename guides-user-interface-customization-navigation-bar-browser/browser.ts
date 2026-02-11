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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.388, g: 0.4, b: 0.945, a: 1 }, stop: 0 },
      { color: { r: 0.545, g: 0.361, b: 0.965, a: 1 }, stop: 0.5 },
      { color: { r: 0.024, g: 0.714, b: 0.831, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered text
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Navigation Bar\n\nimg.ly');
    engine.block.setWidth(titleText, pageWidth);
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, 0);
    engine.block.setPositionY(titleText, pageHeight * 0.35);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(titleText, 'text/fontSize', 24);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });

    // Deselect all blocks for clean hero image
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.select(page);

    // Hide undo/redo using the Feature API
    cesdk.feature.disable('ly.img.navigation.undoRedo');

    // Insert a back button at the start of the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'start' },
      {
        id: 'ly.img.back.navigationBar',
        onClick: () => {
          console.log('Back button clicked');
          window.history.back();
        }
      }
    );

    // Insert a close button at the end of the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.close.navigationBar',
        onClick: () => {
          console.log('Close button clicked');
        }
      }
    );

    // Add a standalone action button with accent styling
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'share',
        label: 'Share',
        icon: '@imgly/Share',
        color: 'accent',
        onClick: async () => {
          cesdk.ui.showNotification({
            message: 'Share dialog would open here',
            type: 'info',
            duration: 'short'
          });
        }
      }
    );

    // Add buttons demonstrating different style variants
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      [
        // Regular variant (default) - standard button appearance
        {
          id: 'ly.img.action.navigationBar',
          key: 'preview',
          label: 'Preview',
          icon: '@imgly/EyeOpen',
          variant: 'regular' as const,
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Opening preview...',
              type: 'info',
              duration: 'short'
            });
          }
        },
        // Plain variant - subtle/borderless appearance
        {
          id: 'ly.img.action.navigationBar',
          key: 'reset',
          label: 'Reset',
          icon: '@imgly/Reset',
          variant: 'plain' as const,
          color: 'danger' as const,
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Reset would clear all changes',
              type: 'warning',
              duration: 'short'
            });
          }
        }
      ]
    );

    // Insert the actions dropdown with export options
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.close.navigationBar' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.saveScene.navigationBar',
            onClick: async () => {
              const scene = await cesdk.engine.scene.saveToString();
              console.log('Scene saved:', scene.length, 'characters');
              cesdk.ui.showNotification({
                message: 'Scene saved to console',
                type: 'success',
                duration: 'short'
              });
            }
          },
          {
            id: 'ly.img.exportImage.navigationBar',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/png'
              });
              cesdk.utils.downloadFile(blobs[0], 'image/png');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'print',
            label: 'Print',
            icon: '@imgly/Print',
            onClick: () => {
              window.print();
            }
          }
        ]
      }
    );

    // Register a custom callback
    cesdk.actions.register('saveScene', async () => {
      const scene = await cesdk.engine.scene.saveToString();
      console.log('Custom save callback:', scene.length, 'characters');
      cesdk.ui.showNotification({
        message: 'Scene saved via custom callback',
        type: 'success',
        duration: 'short'
      });
    });
  }
}

export default Example;
