import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
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

    // Register a custom theme toggle button
    cesdk.ui.registerComponent('my.themeToggle', ({ builder }) => {
      const currentTheme = cesdk.ui.getTheme();
      builder.Button('my.themeToggle.button', {
        label: currentTheme === 'light' ? 'Dark Mode' : 'Light Mode',
        icon: '@imgly/Adjustments',
        variant: 'regular',
        onClick: () => {
          cesdk.ui.setTheme(currentTheme === 'light' ? 'dark' : 'light');
        }
      });
    });

    // Place the theme toggle in the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar' },
      'my.themeToggle'
    );

    // Register a quick actions component with multiple buttons
    cesdk.ui.registerComponent('my.quickActions', ({ builder }) => {
      // Zoom to fit button
      builder.Button('my.quickActions.zoomFit', {
        label: 'Fit',
        icon: '@imgly/ZoomIn',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0]);
          }
        }
      });

      // Reset zoom button
      builder.Button('my.quickActions.resetZoom', {
        label: 'Reset',
        icon: '@imgly/Reset',
        onClick: () => {
          cesdk.engine.scene.setZoomLevel(1.0);
        }
      });

      builder.Separator('my.quickActions.separator');

      // Center canvas button
      builder.Button('my.quickActions.center', {
        label: 'Center',
        icon: '@imgly/Position',
        onClick: () => {
          const pages = cesdk.engine.scene.getPages();
          if (pages.length > 0) {
            cesdk.engine.scene.zoomToBlock(pages[0], { padding: 40 });
          }
        }
      });
    });

    // Place quick actions in the dock
    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
      'ly.img.spacer',
      'my.quickActions'
    ]);

    // Register a component demonstrating different builder elements
    cesdk.ui.registerComponent('my.controls', ({ builder, state }) => {
      // Use state to track toggle value
      const { value: isEnabled, setValue: setIsEnabled } = state(
        'isEnabled',
        false
      );

      builder.Button('my.controls.toggle', {
        label: isEnabled ? 'Enabled' : 'Disabled',
        icon: '@imgly/Checkmark',
        variant: isEnabled ? 'regular' : 'plain',
        onClick: () => {
          setIsEnabled(!isEnabled);
          // eslint-disable-next-line no-console
          console.log(`Controls ${!isEnabled ? 'enabled' : 'disabled'}`);
        }
      });
    });

    // Place controls in the canvas bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.bar', at: 'top' },
      'my.controls'
    );

    // eslint-disable-next-line no-console
    console.log('Create Custom Components example loaded successfully');
  }
}

export default Example;
