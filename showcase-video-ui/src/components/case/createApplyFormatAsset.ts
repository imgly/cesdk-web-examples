import { AssetDefinition, CreativeEngine } from '@cesdk/cesdk-js';

export const createApplyFormatAsset =
  (engine: CreativeEngine) => async (asset: AssetDefinition) => {
    const { meta, id } = asset;
    if (!meta) {
      throw new Error('Asset does not have meta');
    }
    const height = parseInt(meta.formatHeight as string, 10);
    const width = parseInt(meta.formatWidth as string, 10);
    const pageIds = engine.block.findByType('page');
    engine.block.resizeContentAware(pageIds, width, height);
    const scene = engine.scene.get()!;
    engine.block.setString(scene, 'scene/pageFormatId', id);
    // We currently need to update pageDimensions manually.
    engine.block.setFloat(scene, 'scene/pageDimensions/height', height);
    engine.block.setFloat(scene, 'scene/pageDimensions/width', width);

    // update all track:
    const trackIds = engine.block.findByType('track');
    trackIds.forEach((id) => {
      engine.block.fillParent(id);
    });
  };
