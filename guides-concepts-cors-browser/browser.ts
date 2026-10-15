import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  DemoAssetSources,
  PagePresetsAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Cross-Origin Resources (CORS) Guide
 *
 * Loads an image from a host that sends CORS headers and reports blocks whose
 * file the browser blocked.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({ include: ['ly.img.image.*'] })
    );

    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage()!;

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'ly.img.exportImage.navigationBar'
    );

    engine.block.onStateChanged([], (blocks) => {
      for (const block of blocks) {
        if (!engine.block.isValid(block)) continue;
        const state = engine.block.getState(block);
        if (state.type === 'Error' && state.error === 'FileFetch') {
          cesdk.ui.showNotification({
            type: 'error',
            message:
              'A file could not be loaded. Check the browser console for a CORS error.'
          });
        }
      }
    });

    const base = 'https://cdn.img.ly/assets/demo/v3/ly.img.image/images';
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      { uri: `${base}/sample_1-512x341.jpg`, width: 512, height: 341 },
      { uri: `${base}/sample_1-1249x833.jpg`, width: 1249, height: 833 },
      { uri: `${base}/sample_1.jpg`, width: 2500, height: 1667 }
    ]);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, 1200);
    engine.block.setHeight(imageBlock, 800);
    engine.block.appendChild(page, imageBlock);
  }
}

export default Example;
