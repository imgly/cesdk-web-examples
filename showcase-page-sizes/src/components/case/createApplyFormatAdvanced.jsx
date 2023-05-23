import { resizeCanvas } from './lib/CreativeEngineUtils';

/**
 * Creates a function that can be used to apply a layout asset to the current page.
 * It resizes the page in a smart way, retaining "visual identity".
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 * @returns a function that can be used to apply a layout asset to the current page
 */
export const createApplyFormatAssetAdvanced = (engine) => {
  return async (asset) => {
    const pages = engine.block.getChildren(engine.block.findByType('stack')[0]);

    if (pages && pages.length) {
      engine.scene.setDesignUnit(asset.meta.designUnit);

      pages.forEach((pageId) => {
        resizeCanvas(
          engine,
          pageId,
          parseInt(asset.meta.formatWidth, 10),
          parseInt(asset.meta.formatHeight, 10)
        );
      });
    }
  };
};
