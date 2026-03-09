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

/**
 * CE.SDK Plugin: Page Format Customization Guide
 *
 * This example demonstrates:
 * - Creating custom page format presets
 * - Configuring page dimensions with different design units
 * - Registering custom page formats with the UI
 * - Setting a default page format
 * - Controlling orientation behavior
 */
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

    const engine = cesdk.engine;

    // Create a local asset source to hold custom page formats
    engine.asset.addLocalSource('my-custom-formats');

    // Add print formats using millimeter dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'a4-portrait',
      label: { en: 'A4 Portrait' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 210,
          height: 297,
          designUnit: 'Millimeter'
        }
      },
      meta: { default: 'true' }
    });
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'a5-landscape',
      label: { en: 'A5 Landscape' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 210,
          height: 148,
          designUnit: 'Millimeter'
        }
      }
    });

    // Add digital format using pixel dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'instagram-square',
      label: { en: 'Instagram Square' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 1080,
          height: 1080,
          designUnit: 'Pixel'
        }
      },
      meta: { fixedOrientation: 'true' }
    });

    // Add format using inch dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'letter',
      label: { en: 'US Letter' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 8.5,
          height: 11,
          designUnit: 'Inch'
        }
      }
    });

    // Register custom formats with the page format selector
    cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
      sourceIds: ['my-custom-formats']
    });

    // Register middleware to apply formats to existing pages instead of creating new ones
    engine.asset.registerApplyMiddleware(async (sourceId, asset) => {
      if (sourceId === 'my-custom-formats') {
        const pages = engine.block.findByType('page');
        if (pages.length > 0) {
          await engine.asset.applyToBlock(sourceId, asset, pages[0]);
          await engine.scene.zoomToBlock(pages[0]);
        }
        return true;
      }
      return false;
    });

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Zoom to fit the page in the viewport
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await engine.scene.zoomToBlock(pages[0], {
        padding: {
          left: 40,
          top: 40,
          right: 40,
          bottom: 40
        }
      });
    }

    // Open the page resize panel on startup
    cesdk.ui.openPanel('//ly.img.panel/inspector/pageResize');
  }
}

export default Example;
