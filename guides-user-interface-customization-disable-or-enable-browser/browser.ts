import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Disable or Enable Features Example
 *
 * This example demonstrates how to use CE.SDK's Feature API to:
 * - Enable and disable features with simple toggles
 * - Use glob patterns for bulk operations
 * - Create custom predicates based on selection
 * - Extend default predicates with additional conditions
 * - Check feature status and discover available features
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

    // Enable delete feature with default predicate
    cesdk.feature.enable('ly.img.delete');

    // Enable multiple features at once
    cesdk.feature.enable(['ly.img.duplicate', 'ly.img.group']);

    // Disable crop feature
    cesdk.feature.disable('ly.img.crop');

    // Disable multiple features at once
    cesdk.feature.disable(['ly.img.notifications', 'ly.img.preview']);

    // Disable all transform features using glob pattern
    cesdk.feature.disable('ly.img.transform*');

    // Enable all video features using glob pattern
    cesdk.feature.enable('ly.img.video*');

    // Set feature with boolean (terminal predicate)
    cesdk.feature.set('ly.img.fill', true);

    // Set feature with custom predicate based on selection
    cesdk.feature.set('ly.img.duplicate', ({ engine }) => {
      return engine.block.findAllSelected().length > 0;
    });

    // Extend default predicate with additional condition
    cesdk.feature.set('ly.img.delete', ({ defaultPredicate }) => {
      // Only allow delete in design mode
      return defaultPredicate() && engine.scene.getMode() === 'Design';
    });

    // Chain multiple predicates using isPreviousEnable
    cesdk.feature.set('ly.img.replace', ({ isPreviousEnable, engine }) => {
      const previousResult = isPreviousEnable();
      const hasSelection = engine.block.findAllSelected().length > 0;
      return previousResult && hasSelection;
    });

    // Check if a feature is enabled
    const isDeleteEnabled = cesdk.feature.isEnabled('ly.img.delete');
    console.log('Delete feature enabled:', isDeleteEnabled);

    // Check if all video features are enabled (returns true only if ALL match)
    const allVideoEnabled = cesdk.feature.isEnabled('ly.img.video*');
    console.log('All video features enabled:', allVideoEnabled);

    // List all registered feature IDs
    const allFeatures = cesdk.feature.list();
    console.log('All features:', allFeatures.slice(0, 10), '...');

    // List features matching a pattern
    const navigationFeatures = cesdk.feature.list({
      matcher: 'ly.img.navigation*'
    });
    console.log('Navigation features:', navigationFeatures);

    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'toggle-dock',
          label: 'Toggle Dock',
          onClick: () => {
            const enabled = cesdk.feature.isEnabled('ly.img.dock');
            if (enabled) {
              cesdk.feature.disable('ly.img.dock');
              console.log('Dock feature disabled');
            } else {
              cesdk.feature.enable('ly.img.dock');
              console.log('Dock feature enabled');
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'toggle-crop',
          label: 'Toggle Crop Features',
          icon: '@imgly/Crop',
          onClick: () => {
            const enabled = cesdk.feature.isEnabled('ly.img.crop');
            if (enabled) {
              cesdk.feature.disable('ly.img.crop*');
              console.log('All crop features disabled');
            } else {
              cesdk.feature.enable('ly.img.crop*');
              console.log('All crop features enabled');
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'log-status',
          label: 'Log Feature Status',
          icon: '@imgly/Info',
          onClick: () => {
            console.log('=== Feature Status ===');
            console.log('Dock:', cesdk.feature.isEnabled('ly.img.dock'));
            console.log('Duplicate:', cesdk.feature.isEnabled('ly.img.duplicate'));
            console.log('Crop:', cesdk.feature.isEnabled('ly.img.crop'));
            console.log('Fill:', cesdk.feature.isEnabled('ly.img.fill'));
            console.log('Navigation features:', cesdk.feature.list({ matcher: 'ly.img.navigation*' }));
          }
        }
      ]
    });

    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setFill(page, gradientFill);
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.99, g: 0.98, b: 0.97, a: 1 }, stop: 0 },
      { color: { r: 0.97, g: 0.96, b: 0.94, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

    const titleBlock = engine.block.create('text');
    engine.block.appendChild(page, titleBlock);
    engine.block.replaceText(titleBlock, 'Disable or Enable Features');
    engine.block.setTextFontSize(titleBlock, 24);
    engine.block.setTextColor(titleBlock, { r: 0.25, g: 0.22, b: 0.20, a: 1 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setPositionX(titleBlock, pageWidth * 0.1);
    engine.block.setPositionY(titleBlock, pageHeight * 0.40);

    const subtitleBlock = engine.block.create('text');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.replaceText(subtitleBlock, 'IMG.LY');
    engine.block.setTextFontSize(subtitleBlock, 12);
    engine.block.setTextColor(subtitleBlock, { r: 0.65, g: 0.45, b: 0.40, a: 1 });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.setPositionX(subtitleBlock, pageWidth * 0.1);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.52);

    engine.block.setSelected(titleBlock, true);

    console.log('Disable or Enable Features example loaded successfully!');
  }
}

export default Example;
