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
      { color: { r: 0.18, g: 0.42, b: 0.71, a: 1 }, stop: 0 },
      { color: { r: 0.31, g: 0.58, b: 0.8, a: 1 }, stop: 0.5 },
      { color: { r: 0.13, g: 0.7, b: 0.67, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create centered text
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Dock\n\nimg.ly');
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

    // Configure dock to use large icons and hide text labels
    cesdk.engine.editor.setSetting('dock/iconSize', 'large');
    cesdk.engine.editor.setSetting('dock/hideLabels', true);

    // Set a simplified dock for Text edit mode
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.dock', when: { editMode: 'Text' } },
      [
        {
          id: 'ly.img.assetLibrary.dock',
          key: 'ly.img.text',
          icon: '@imgly/Text',
          label: 'libraries.ly.img.text.label',
          entries: ['ly.img.text']
        }
      ]
    );

    // Add a custom asset source, create an entry for it, and add a dock button
    // Step 1: Create the asset source (stores/provides assets)
    cesdk.engine.asset.addLocalSource('my.brand.assets');

    // Step 2: Create an asset library entry (UI representation of the source)
    cesdk.ui.addAssetLibraryEntry({
      id: 'my.brand.entry',
      sourceIds: ['my.brand.assets'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Step 3: Add a dock button that opens the entry
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'end' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'brand',
        entries: ['my.brand.entry'],
        label: 'Brand',
        icon: '@imgly/Favorite'
      }
    );

    // Register a custom component and add it to the dock bottom
    cesdk.ui.registerComponent('my.settings.button', ({ builder }) => {
      builder.Button('settings', {
        label: 'Settings',
        icon: '@imgly/Settings',
        onClick: () => {
          cesdk.ui.showNotification({
            message: 'Settings panel would open here',
            type: 'info',
            duration: 'short'
          });
        }
      });
    });

    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock', position: 'end' }, [
      'ly.img.spacer',
      'my.settings.button'
    ]);

    // Retrieve and log the current dock order for reference
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.dock'
    });
    console.log('Current dock order:', currentOrder);
  }
}

export default Example;
