import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Navigation Bar Customization Example
 *
 * Demonstrates customizing the navigation bar with custom action buttons,
 * back navigation, undo/redo, and an actions dropdown.
 */
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
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create gradient fill for page background
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
    engine.block.findAllSelected().forEach((block) => {
      engine.block.setSelected(block, false);
    });

    // Select the page for hero
    engine.block.select(page);

    // Set custom navigation bar order
    cesdk.ui.setNavigationBarOrder([
      // Back button with custom click handler
      {
        id: 'ly.img.back.navigationBar',
        onClick: () => {
          console.log('Back button clicked');
          window.history.back();
        }
      },

      // Undo/redo controls
      'ly.img.undoRedo.navigationBar',

      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',

      // Zoom controls
      'ly.img.zoom.navigationBar',

      // Custom action button - regular variant (default)
      {
        id: 'ly.img.action.navigationBar',
        key: 'share',
        label: 'Share',
        icon: '@imgly/Share',
        variant: 'regular',
        onClick: async () => {
          cesdk.ui.showNotification({
            message: 'Share dialog would open here',
            type: 'info',
            duration: 'short'
          });
        }
      },

      // Custom button - accent color
      {
        id: 'ly.img.action.navigationBar',
        key: 'publish',
        label: 'Publish',
        icon: '@imgly/Upload',
        color: 'accent',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Publishing design...',
            type: 'success',
            duration: 'short'
          });
        }
      },

      // Custom button - plain variant
      {
        id: 'ly.img.action.navigationBar',
        key: 'preview',
        label: 'Preview',
        icon: '@imgly/EyeOpen',
        variant: 'plain',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Opening preview...',
            type: 'info',
            duration: 'short'
          });
        }
      },

      // Custom button - danger color
      {
        id: 'ly.img.action.navigationBar',
        key: 'reset',
        label: 'Reset',
        icon: '@imgly/Reset',
        color: 'danger',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Reset would clear all changes',
            type: 'warning',
            duration: 'short'
          });
        }
      },

      // Actions dropdown with save and download options
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          // Save button with custom handler
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
          // Download as image
          {
            id: 'ly.img.exportImage.navigationBar',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/png'
              });
              cesdk.utils.downloadFile(blobs[0], 'image/png');
            }
          },
          // Custom print action
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
    ]);
  }
}

export default Example;
