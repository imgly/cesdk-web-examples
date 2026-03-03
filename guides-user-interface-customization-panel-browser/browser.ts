import type {
  EditorPlugin,
  EditorPluginContext,
  PanelPosition
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';

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
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

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
