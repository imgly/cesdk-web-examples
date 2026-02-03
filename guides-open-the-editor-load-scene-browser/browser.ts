import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Add default asset sources for scene resources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
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
