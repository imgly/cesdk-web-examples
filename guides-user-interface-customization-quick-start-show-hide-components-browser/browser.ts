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

    // Hide components using Feature API (disables both UI and functionality)
    // This hides the page resize controls from the navigation bar
    cesdk.feature.disable('ly.img.navigation.pageResize');

    // Hide specific components using Component Order API
    // This removes the preview button but keeps preview functionality (keyboard shortcut still works)
    const previewResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.preview.navigationBar'
    });
    console.log(
      `Removed preview button: ${previewResult.removed} component(s)`
    );

    // Remove all separators from the navigation bar for a cleaner look
    const separatorResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.separator'
    });
    console.log(`Removed separators: ${separatorResult.removed} component(s)`);

    // Remove components using glob patterns
    // This removes all zoom-related components
    const zoomResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.zoom.*'
    });
    console.log(`Removed zoom components: ${zoomResult.removed} component(s)`);

    // Remove from multiple areas at once using area glob patterns
    // This removes all spacers from all areas
    const spacerResult = cesdk.ui.removeOrderComponent({
      in: '*',
      match: 'ly.img.spacer'
    });
    console.log('Removed spacers from all areas:', spacerResult);

    // Hide components only in specific edit modes using the 'when' context
    // This removes crop controls only when in Transform mode (keeps them in Crop mode)
    const conditionalResult = cesdk.ui.removeOrderComponent({
      in: 'ly.img.inspector.bar',
      match: 'ly.img.crop.inspectorBar',
      when: { editMode: 'Transform' }
    });
    console.log(
      `Removed crop controls in Transform mode: ${conditionalResult.removed} component(s)`
    );

    // Verify component removal by checking the current order
    const currentOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    console.log('Current navigation bar components:', currentOrder);

    console.log('Show/Hide Components example loaded successfully');
  }
}

export default Example;
