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
import businessCardSceneString from './assets/business-card.scene?raw';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(templateUrl);

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
    }

    // Zoom to fit the page in view
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.scene.zoomToBlock(pages[0]);
    }

    // Add custom navigation bar actions for template operations
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-from-string-action',
          label: 'Load from String',
          iconName: '@imgly/icons/Essentials/Download',
          onClick: async () => {
            await engine.scene.loadFromString(businessCardSceneString);
            const scene = engine.scene.get();
            if (scene != null) {
              await engine.scene.zoomToBlock(scene, { padding: 40 });
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'apply-template-action',
          label: 'Apply Template',
          iconName: '@imgly/icons/Essentials/TemplateLibrary',
          onClick: async () => {
            const applyTemplateUrl =
              'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_photo_1.scene';
            await engine.scene.applyTemplateFromURL(applyTemplateUrl);
            const scene = engine.scene.get();
            if (scene != null) {
              await engine.scene.zoomToBlock(scene, { padding: 40 });
            }
          }
        }
      ]
    });
  }
}

export default Example;
