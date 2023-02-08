import CreativeEditorSDK, {
  AssetSource,
  DesignBlockType,
  UserInterfaceElements
} from '@cesdk/cesdk-js';
import { applyQuerySearch, paginateAssetResult } from './AssetSourceUtilities';

const audioUploads = new Map();

export const addLocalAudioUploadEntry = (
  defaultEntries: UserInterfaceElements.AssetLibraryEntry[]
) => {
  const uploadEntry = defaultEntries.find((entry) => {
    return entry.id === 'ly.img.upload';
  });
  if (uploadEntry) {
    uploadEntry.sourceIds.push('ly.img.audio.upload');
    uploadEntry.cardLabel = (assetResult) => {
      // @ts-ignore
      if (assetResult.context.sourceId === 'ly.img.audio.upload') {
        return assetResult.label;
      }
      return undefined;
    };
  }
  const audioEntry = defaultEntries.find((entry) => {
    return entry.id === 'ly.img.audio';
  });

  if (audioEntry) {
    audioEntry.sourceIds.unshift('ly.img.audio.upload');
  }
};

export function createLocalAudioUploadAssetLibrary(
  cesdkRef: React.MutableRefObject<CreativeEditorSDK>
) {
  const i18nEntries = {
    'libraries.ly.img.upload.ly.img.audio.upload.label': 'Audio Uploads',
    'libraries.ly.img.audio.ly.img.audio.upload.label': 'Uploads'
  };

  const assetSource: AssetSource = {
    id: 'ly.img.audio.upload',
    async findAssets(queryData) {
      const assets = Array.from(audioUploads.values());
      const filteredAssets = applyQuerySearch(assets, queryData?.query);
      return Promise.resolve(paginateAssetResult(filteredAssets, queryData));
    },
    canManageAssets: true,
    // @ts-ignore
    applyAsset: async (asset) => {
      const api = cesdkRef.current.engine;
      const sceneId = api.scene.get();

      if (sceneId && asset.meta?.uri) {
        const audioBlock = api.block.create(DesignBlockType.Audio);

        api.block.setString(audioBlock, 'audio/fileURI', asset.meta.uri);
        const duration = asset.meta.duration && parseFloat(asset.meta.duration);
        if (duration && !Number.isNaN(duration)) {
          const totalSceneDuration = api.block.getTotalSceneDuration(sceneId);
          api.block.setDuration(
            audioBlock,
            Math.min(duration, totalSceneDuration)
          );
        }
        api.block.appendChild(sceneId, audioBlock);

        const rectShapes = api.block.findByType(DesignBlockType.RectShape);
        rectShapes.forEach((shape) => {
          const videoFill = api.block.getFill(shape);
          api.block.setBool(videoFill, 'fill/video/muted', true);
        });

        api.block.setBool(audioBlock, 'audio/muted', false);

        api.editor.addUndoStep();
      }
    },
    addAsset(asset) {
      audioUploads.set(asset.id, {
        id: asset.id,
        label: asset.meta?.filename,
        thumbUri: 'https://img.ly/static/cesdk/audio-wave.svg',
        // @ts-ignore
        size: asset.size,
        meta: asset.meta,
        context: {
          sourceId: 'ly.img.audio.upload'
        }
      });

      return Promise.resolve(asset.id);
    },
    getSupportedMimeTypes() {
      return ['audio/x-m4a', 'audio/m4a', 'audio/mp3'];
    }
  };

  return {
    assetSource,
    i18nEntries
  };
}
