import type {
  EditorPlugin,
  EditorPluginContext,
  EnginePlugin,
  EnginePluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

/**
 * CE.SDK Plugin: Custom Feature Plugin Guide
 *
 * Demonstrates building two reusable plugins:
 * - An editor plugin (CustomFeaturePlugin) that exposes options through
 *   its constructor, overrides the built-in export action, extends the
 *   dock and replaces the inspector bar
 * - An engine plugin (BrandAssetsPlugin) that extends engine
 *   functionality with a custom asset source and stays headless-safe
 */

interface CustomFeaturePluginOptions {
  /** Image added to the page by the custom dock button. */
  randomImageURL?: string;
  /** Whether the plugin adds its dock button. */
  showDockButton?: boolean;
}

class CustomFeaturePlugin implements EditorPlugin {
  name = 'custom-feature';

  version = '1.0.0';

  private options: Required<CustomFeaturePluginOptions>;

  constructor(options: CustomFeaturePluginOptions = {}) {
    this.options = {
      randomImageURL:
        options.randomImageURL ??
        'https://img.ly/static/ubq_samples/sample_1.jpg',
      showDockButton: options.showDockButton ?? true
    };
  }

  initialize({ cesdk }: EditorPluginContext): void {
    if (!cesdk) {
      throw new Error('CustomFeaturePlugin requires the editor');
    }

    // Replace the built-in export behavior. The plugin now owns the
    // complete export flow triggered by the navigation bar button.
    cesdk.actions.register('exportDesign', async (exportOptions) => {
      const { blobs, options } = await cesdk.utils.export({
        mimeType: 'image/png',
        ...exportOptions
      });
      await cesdk.utils.downloadFile(blobs[0], options.mimeType);
      cesdk.ui.showNotification({
        message: 'Export handled by CustomFeaturePlugin',
        type: 'info'
      });
    });

    // Register the custom dock buttons
    if (this.options.showDockButton) {
      cesdk.ui.registerComponent('customFeature.dock', ({ builder }) => {
        builder.Button('customFeature.dock.image', {
          label: 'Custom Image',
          icon: '@imgly/Image',
          onClick: async () => {
            await cesdk.engine.block.addImage(this.options.randomImageURL, {
              size: { width: 400, height: 300 }
            });
          }
        });
        builder.Button('customFeature.dock.export', {
          label: 'Custom Export',
          icon: '@imgly/Download',
          onClick: () => {
            cesdk.actions.run('exportDesign');
          }
        });
      });

      // Extend the existing dock order instead of replacing it —
      // the plugin's buttons go first, existing entries stay
      const order = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
      cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
        'customFeature.dock',
        ...order
      ]);
    }

    // Replace the inspector bar with a focused set of approved controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
      'ly.img.spacer',
      'ly.img.fill.inspectorBar',
      'ly.img.separator',
      'ly.img.inspectorToggle.inspectorBar'
    ]);
  }
}

// An engine plugin only receives the engine in its context, so it also
// runs in headless setups. This one extends engine functionality with
// an asset source providing a single sticker asset.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}

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
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    // Apply the editor plugin after the base editor setup
    await cesdk.addPlugin(
      new CustomFeaturePlugin({
        randomImageURL: 'https://img.ly/static/ubq_samples/sample_1.jpg'
      })
    );

    // Engine plugins attach to the engine — the same call works in
    // headless setups where no editor exists
    const engine = cesdk.engine;
    await engine.addPlugin(new BrandAssetsPlugin());

    // Add the engine plugin's asset as sample content
    const result = await engine.asset.findAssets('brand-assets', {
      page: 0,
      perPage: 10
    });
    const sticker = await engine.asset.apply('brand-assets', result.assets[0]);
    if (sticker != null) {
      engine.block.setWidth(sticker, 240);
      engine.block.setHeight(sticker, 240);
      engine.block.setPositionX(sticker, 480);
      engine.block.setPositionY(sticker, 240);
      engine.block.select(sticker);
    }

    // Label the custom functionality so it's easy to spot in the demo
    const page = engine.block.findByType('page')[0];
    const note = engine.block.create('text');
    engine.block.replaceText(
      note,
      'CustomFeaturePlugin (EditorPlugin):\n' +
        '← Custom Image & Custom Export dock buttons\n' +
        '↑ reduced inspector bar\n' +
        '\n' +
        'BrandAssetsPlugin (EnginePlugin):\n' +
        '→ sticker from its asset source'
    );
    engine.block.setTextFontSize(note, 24);
    engine.block.setWidth(note, 420);
    engine.block.setHeightMode(note, 'Auto');
    engine.block.setPositionX(note, 40);
    engine.block.setPositionY(note, 200);
    engine.block.appendChild(page, note);

    console.log('Custom feature plugin guide initialized successfully.');
  }
}

export default Example;
