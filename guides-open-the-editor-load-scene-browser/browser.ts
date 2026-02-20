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
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    cesdk.addPlugin(new DesignEditorConfig());

    cesdk.addPlugin(new ColorPaletteAssetSource());
    cesdk.addPlugin(new CropPresetsAssetSource());
    cesdk.addPlugin(new DemoAssetSources());
    cesdk.addPlugin(new EffectsAssetSource());
    cesdk.addPlugin(new FiltersAssetSource());
    cesdk.addPlugin(new PagePresetsAssetSource());
    cesdk.addPlugin(new StickerAssetSource());
    cesdk.addPlugin(new TextAssetSource());
    cesdk.addPlugin(new TextComponentAssetSource());
    cesdk.addPlugin(new TypefaceAssetSource());
    cesdk.addPlugin(new VectorShapeAssetSource());
    cesdk.addPlugin(new BlurAssetSource());
    cesdk.addPlugin(new DemoAssetSources());

    const engine = cesdk.engine;
    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(sceneUrl);

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.setDropShadowEnabled(textBlocks[0], true);
    }

    // Zoom to fit the page in view
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.scene.zoomToBlock(pages[0]);
    }
  }
}

export default Example;
