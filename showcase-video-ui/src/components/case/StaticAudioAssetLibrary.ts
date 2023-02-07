import {
  API,
  AssetSource,
  AssetResult,
  DesignBlockType
} from '@cesdk/cesdk-js';
import { filterAssets, sliceAssets } from './AssetSourceUtilities';

export function createStaticAudioSource(
  engine: API,
  staticAssets: AssetResult[]
): AssetSource {
  const StaticAudioSource: AssetSource = {
    id: 'ly.img.audio',
    applyAsset: async (asset) => {
      const sceneId = engine.scene.get();

      if (sceneId && asset.meta?.uri) {
        const audioBlock = engine.block.create(DesignBlockType.Audio);

        engine.block.setString(audioBlock, 'audio/fileURI', asset.meta.uri);
        const duration = asset.meta.duration && parseFloat(asset.meta.duration);
        if (duration && !Number.isNaN(duration)) {
          const totalSceneDuration =
            engine.block.getTotalSceneDuration(sceneId);
          engine.block.setDuration(
            audioBlock,
            Math.min(duration, totalSceneDuration)
          );
        }
        engine.block.appendChild(sceneId, audioBlock);

        const rectShapes = engine.block.findByType(DesignBlockType.RectShape);
        rectShapes.forEach((shape) => {
          const videoFill = engine.block.getFill(shape);
          engine.block.setBool(videoFill, 'fill/video/muted', true);
        });

        engine.block.setBool(audioBlock, 'audio/muted', false);

        engine.editor.addUndoStep();
      }
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

  return StaticAudioSource;
}
