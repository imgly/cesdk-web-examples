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

// Import scene file as string for loadFromString demonstration
import businessCardSceneString from './assets/business-card.scene?raw';

// Template sources
const fashionAdArchiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';

const postcardSceneUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

/**
 * CE.SDK Plugin: Import Templates
 *
 * Demonstrates loading templates from different sources:
 * - Archive URLs (.zip files with bundled assets)
 * - Scene URLs (.scene files)
 * - Serialized strings (imported scene content)
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
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

    // Load template from a scene file URL
    await engine.scene.loadFromURL(postcardSceneUrl);

    // Zoom viewport to fit the loaded scene
    const scene = engine.scene.get();
    if (scene != null) {
      await engine.scene.zoomToBlock(scene, { padding: 40 });
    }

    // Verify the loaded scene
    const loadedScene = engine.scene.get();
    if (loadedScene != null) {
      const pages = engine.scene.getPages();
      // eslint-disable-next-line no-console
      console.log(`Template loaded with ${pages.length} page(s)`);
    }

    // Configure navigation bar with template loading buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-archive',
        label: 'Import Archive',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from archive URL (bundled assets)
          await engine.scene.loadFromArchiveURL(fashionAdArchiveUrl);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-url',
        label: 'Import URL',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from scene URL
          await engine.scene.loadFromURL(postcardSceneUrl);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-string',
        label: 'Import String',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from serialized string
          await engine.scene.loadFromString(businessCardSceneString);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      }
    ]);
  }
}

export default Example;
