import {
  AssetDefinition,
  CreativeEngine,
  DesignBlockType
} from '@cesdk/cesdk-js';

export const createDefaultApplyAssetScene =
  (engine: CreativeEngine) => async (asset: AssetDefinition) => {
    if (!asset.meta || !asset.meta.uri) {
      throw new Error('Asset does not have a uri');
    }
    const scene = await engine.scene.loadFromURL(asset.meta.uri);
    // Currently we need to set page dimensions manually by getting the dimension of one page.
    // Note: Assumes that all pages have the same dimensions.
    const somePage = engine.block.findByType('page')[0];
    const width = engine.block.getWidth(somePage);
    const height = engine.block.getHeight(somePage);
    engine.block.setFloat(scene, 'scene/pageDimensions/height', height);
    engine.block.setFloat(scene, 'scene/pageDimensions/width', width);
    engine.block.setString(scene, 'scene/pageFormatId', 'Custom');
    return scene;
  };
