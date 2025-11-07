import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

// import {
//   DesignEditorConfig,
//   VideoEditorConfig,
//   PhotoEditorConfig
// } from '@cesdk/cesdk-js/configs/';

// import {
//   FiltersAssetSource,
//   EffectsAssetSource,
//   ColorPaletteAssetSource
// } from '@cesdk/cesdk-js/plugins';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Configure the editor
    // await cesdk.addPlugin(new DesignEditorConfig())
    // await cesdk.addPlugin(new VideoEditorConfig())
    // await cesdk.addPlugin(new PhotoEditorConfig())

    // Configure the asset sources
    // await cesdk.addPlugin(new FiltersAssetSource())
    // await cesdk.addPlugin(new EffectsAssetSource())
    // await cesdk.addPlugin(new ColorPaletteAssetSource())

    // Create the scene
    await cesdk.createDesignScene();
  }
}

export default Example;
