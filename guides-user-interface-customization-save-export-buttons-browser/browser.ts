import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Save and Export Buttons Example
 *
 * Demonstrates adding save/export buttons to the navigation bar
 * and overriding their default behavior with custom handlers.
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

    // Create gradient fill for page background (purple to violet to cyan diagonal)
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.388, g: 0.4, b: 0.945, a: 1 }, stop: 0 }, // #6366f1 indigo
      { color: { r: 0.545, g: 0.361, b: 0.965, a: 1 }, stop: 0.5 }, // #8b5cf6 violet
      { color: { r: 0.024, g: 0.714, b: 0.831, a: 1 }, stop: 1 } // #06b6d4 cyan
    ]);
    // Diagonal gradient from top-left to bottom-right
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered text with title and subtitle
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Save and Export Buttons\n\nimg.ly');
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

    // Select the page to show the page toolbar (looks better in hero)
    engine.block.select(page);

    // Override the saveScene action with custom logic
    cesdk.actions.register('saveScene', async () => {
      // Replace with your backend upload logic
      console.trace('saveScene action triggered');
      const archive = await cesdk.engine.scene.saveToArchive();
      cesdk.utils.downloadFile(archive, 'application/zip');
    });

    // Add all save and export buttons to the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.saveScene.navigationBar',
          'ly.img.exportImage.navigationBar',

          {
            // Override the PDF export button's onClick callback
            id: 'ly.img.exportPDF.navigationBar',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'application/pdf'
              });
              cesdk.utils.downloadFile(blobs[0], 'application/pdf');
              cesdk.ui.showNotification({
                message: 'PDF exported successfully!',
                type: 'success',
                duration: 'short'
              });
            }
          },
          'ly.img.exportScene.navigationBar',
          'ly.img.exportArchive.navigationBar'
        ]
      }
    );
  }
}

export default Example;
