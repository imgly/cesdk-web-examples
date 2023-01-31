import CreativeEditorSDK, {
  AssetResult,
  AssetSource,
  DesignBlockType
} from '@cesdk/cesdk-js';
import { filterAssets, sliceAssets } from './AssetSourceUtilities';

export function createStaticVideoScenesSource(
  cesdkRef: React.MutableRefObject<CreativeEditorSDK>,
  staticAssets: AssetResult[]
): AssetSource {
  const StaticVideoScenesSource: AssetSource = {
    id: 'exampleVideoScenes',
    applyAsset: async (asset) => {
      const engine = cesdkRef.current.engine;
      await engine.scene.loadFromURL(asset.meta!.uri!);
      const scene = engine.scene.get()!;
      // Currently we need to set page dimensions manually.
      const somePage = engine.block.findByType(DesignBlockType.Page)[0];
      const width = engine.block.getWidth(somePage);
      const height = engine.block.getHeight(somePage);
      engine.block.setFloat(scene, 'scene/pageDimensions/height', height);
      engine.block.setFloat(scene, 'scene/pageDimensions/width', width);
      engine.block.setString(scene, 'scene/pageFormatId', 'Custom');
    },
    findAssets: (queryData) => {
      const { page: currentPage } = queryData;

      const filteredAssets = filterAssets(staticAssets, queryData);

      const total = filteredAssets.length;
      const assetsInCurrentPage = sliceAssets(filteredAssets, queryData);

      const totalFetched =
        queryData.page * queryData.perPage + assetsInCurrentPage.length;
      const nextPage = totalFetched < total ? currentPage + 1 : undefined;

      return Promise.resolve({
        assets: filteredAssets,
        total,
        currentPage,
        nextPage
      });
    }
  };

  return StaticVideoScenesSource;
}
