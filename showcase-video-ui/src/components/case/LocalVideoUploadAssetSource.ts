import CreativeEditorSDK, {
  AssetSource,
  UserInterfaceElements
} from '@cesdk/cesdk-js';
import { applyQuerySearch, paginateAssetResult } from './AssetSourceUtilities';

const videoUploads = new Map();

export const addLocalVideoUploadEntry = (
  defaultEntries: UserInterfaceElements.AssetLibraryEntry[]
) => {
  const uploadEntry = defaultEntries.find((entry) => {
    return entry.id === 'ly.img.upload';
  });
  if (uploadEntry) {
    uploadEntry.sourceIds.push('ly.img.video.upload');
  }
  const videoEntry = defaultEntries.find((entry) => {
    return entry.id === 'ly.img.video';
  });

  if (videoEntry) {
    videoEntry.sourceIds.unshift('ly.img.video.upload');
  }
};

export function createLocalVideoUploadAssetLibrary(
  cesdkRef: React.MutableRefObject<CreativeEditorSDK>
) {
  const i18nEntries = {
    'libraries.ly.img.upload.ly.img.video.upload.label': 'Video Uploads',
    'libraries.ly.img.video.ly.img.video.upload.label': 'Uploads'
  };

  const assetSource: AssetSource = {
    id: 'ly.img.video.upload',
    async findAssets(queryData) {
      const assets = Array.from(videoUploads.values());
      const filteredAssets = applyQuerySearch(assets, queryData?.query);
      return Promise.resolve(paginateAssetResult(filteredAssets, queryData));
    },
    canManageAssets: true,
    addAsset(asset) {
      videoUploads.set(asset.id, {
        id: asset.id,
        label: asset.meta?.filename,
        thumbUri: asset.thumbUri,
        // @ts-ignore
        size: asset.size,
        meta: asset.meta,
        context: {
          sourceId: 'ly.img.video.upload'
        }
      });

      return Promise.resolve(asset.id);
    },
    getSupportedMimeTypes() {
      return ['video/mp4'];
    }
  };

  return {
    assetSource,
    i18nEntries
  };
}
