import {
  AssetDefinition,
  CreativeEngine,
  DesignBlockType
} from '@cesdk/cesdk-js';

export const createApplyFormatAsset =
  (engine: CreativeEngine) => async (asset: AssetDefinition) => {
    const { meta, id } = asset;
    if (!meta) {
      throw new Error('Asset does not have meta');
    }
    const height = parseInt(meta.formatHeight as string, 10);
    const width = parseInt(meta.formatWidth as string, 10);
    const pageIds = engine.block.findByType(DesignBlockType.Page);
    pageIds.forEach((pageId) =>
      resizePage(engine, pageId, {
        height: height,
        width: width
      })
    );
    const scene = engine.scene.get()!;
    engine.block.setString(scene, 'scene/pageFormatId', id);
    // We currently need to update pageDimensions manually.
    engine.block.setFloat(scene, 'scene/pageDimensions/height', height);
    engine.block.setFloat(scene, 'scene/pageDimensions/width', width);
  };

const resizePage = (
  engine: CreativeEngine,
  pageId: number,
  size: { width: number; height: number }
) => {
  const currentPageWidth = engine.block.getWidth(pageId);
  const currentPageHeight = engine.block.getHeight(pageId);

  const scale = Math.min(
    size.width / currentPageWidth,
    size.height / currentPageHeight
  );

  const scaledWidth = currentPageWidth * scale;
  const scaledHeight = currentPageHeight * scale;

  const offsetX = 0.5 * (size.width - scaledWidth);
  const offsetY = 0.5 * (size.height - scaledHeight);

  engine.block.scale(pageId, scale, 0.5, 0.5);
  const children = engine.block.getChildren(pageId);
  children.forEach((child) => {
    const x = engine.block.getPositionX(child);
    const y = engine.block.getPositionY(child);
    engine.block.setPositionX(child, x + offsetX);
    engine.block.setPositionY(child, y + offsetY);
  });

  engine.block.setWidth(pageId, size.width);
  engine.block.setHeight(pageId, size.height);
};
