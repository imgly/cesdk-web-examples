import 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/cesdk.umd.js';

window.onload = async () => {
  // highlight-mock-asset-db
  const videoUploads = new Map();
  const audioUploads = new Map();
  // highlight-mock-asset-db

  const container = document.getElementById('cesdk');

  if (!container) return;

  const config = {
    theme: 'light',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets',
    // highlight-initial-scene-mode
    initialSceneMode: 'Video',
    // highlight-initial-scene-mode
    // highlight-asset-sources
    assetSources: {
      'ly.img.video.upload': {
        // highlight-asset-sources
        // highlight-asset-fns
        async findAssets(queryData) {
          const assets = Array.from(videoUploads.values());
          const filteredAssets = applyQuerySearch(assets, queryData?.query);
          return Promise.resolve(
            paginateAssetResult(filteredAssets, queryData)
          );
        },
        addAsset(asset) {
          videoUploads.set(asset.id, {
            id: asset.id,
            label: asset.meta?.filename,
            thumbUri: asset.thumbUri,
            size: asset.size,
            meta: asset.meta,
            context: {
              sourceId: 'ly.img.video.upload'
            }
          });

          return Promise.resolve(asset.id);
        },
        // highlight-asset-fns
        // highlight-enable-uploads
        canManageAssets: true,
        getSupportedMimeTypes() {
          return ['video/mp4'];
        }
        // highlight-enable-uploads
      },
      'ly.img.audio.upload': {
        async findAssets(queryData) {
          const assets = Array.from(audioUploads.values());
          const filteredAssets = applyQuerySearch(assets, queryData?.query);
          return Promise.resolve(
            paginateAssetResult(filteredAssets, queryData)
          );
        },
        addAsset(asset) {
          audioUploads.set(asset.id, {
            id: asset.id,
            label: asset.meta?.filename,
            thumbUri: 'https://img.ly/static/cesdk/audio-wave.svg',
            size: asset.size,
            meta: asset.meta,
            context: {
              sourceId: 'ly.img.audio.upload'
            }
          });

          return Promise.resolve(asset.id);
        },
        // highlight-audio-duration
        applyAsset: async (asset) => {
          const api = cesdk.engine;
          const sceneId = api.scene.get();

          if (sceneId && asset.meta?.uri) {
            // create an audio block
            const audioBlock = api.block.create('//ly.img.ubq/audio');

            // set the audio file URI
            api.block.setString(audioBlock, 'audio/fileURI', asset.meta.uri);

            // check if the asset has a duration and set it on the block
            const duration =
              asset.meta.duration && parseFloat(asset.meta.duration);
            if (duration && !Number.isNaN(duration)) {
              const totalSceneDuration =
                api.block.getTotalSceneDuration(sceneId);
              api.block.setDuration(
                audioBlock,
                // make sure the duration is not longer than the total scene duration
                Math.min(duration, totalSceneDuration)
              );
            }

            // add the audio block to the scene
            api.block.appendChild(sceneId, audioBlock);

            // optional: mute all video fills
            const rectShapes = api.block.findByType('//ly.img.ubq/shapes/rect');
            rectShapes.forEach((shape) => {
              const videoFill = api.block.getFill(shape);
              api.block.setBool(videoFill, 'fill/video/muted', true);
            });

            // unmute the audio block
            api.block.setBool(audioBlock, 'audio/muted', false);

            // add an undo step
            api.editor.addUndoStep();
          }
        },
        // highlight-audio-duration
        canManageAssets: true,
        getSupportedMimeTypes() {
          return ['audio/x-m4a', 'audio/m4a', 'audio/mp3'];
        }
      }
    },
    ui: {
      elements: {
        view: 'default',
        panels: {
          settings: true
        },
        libraries: {
          insert: {
            // highlight-asset-library-entries
            entries: (defaultEntries) => {
              const uploadEntry = defaultEntries.find((entry) => {
                return entry.id === 'ly.img.upload';
              });
              if (uploadEntry) {
                uploadEntry.sourceIds.push('ly.img.video.upload');
                uploadEntry.sourceIds.push('ly.img.audio.upload');
                uploadEntry.previewLength = 3;
                uploadEntry.gridColumns = 3;
                uploadEntry.gridItemHeight = 'square';

                uploadEntry.previewBackgroundType = 'cover';
                uploadEntry.gridBackgroundType = 'cover';
                uploadEntry.cardLabel = (assetResult) => {
                  if (assetResult.context.sourceId === 'ly.img.audio.upload') {
                    return assetResult.label;
                  }
                  return undefined;
                };
              }

              const videoEntry = defaultEntries.find((entry) => {
                return entry.id === 'ly.img.video';
              });

              const audioEntry = defaultEntries.find((entry) => {
                return entry.id === 'ly.img.audio';
              });

              if (videoEntry) {
                videoEntry.sourceIds.unshift('ly.img.video.upload');
              }

              if (audioEntry) {
                audioEntry.sourceIds.unshift('ly.img.audio.upload');
              }

              return defaultEntries;
            }
            // highlight-asset-library-entries
          }
        },

        navigation: {
          position: 'top',
          action: {
            save: true,
            load: true,
            download: true,
            export: true
          }
        }
      }
    },
    // highlight-translations
    i18n: {
      de: {
        'libraries.ly.img.upload.ly.img.upload.label': 'Bilder Uploads',
        'libraries.ly.img.upload.ly.img.video.upload.label': 'Video Uploads',
        'libraries.ly.img.upload.ly.img.audio.upload.label': 'Audio Uploads',
        'libraries.ly.img.video.ly.img.video.upload.label': 'Uploads',
        'libraries.ly.img.audio.ly.img.audio.upload.label': 'Uploads'
      },
      en: {
        'libraries.ly.img.upload.ly.img.upload.label': 'Image Uploads',
        'libraries.ly.img.upload.ly.img.video.upload.label': 'Video Uploads',
        'libraries.ly.img.upload.ly.img.audio.upload.label': 'Audio Uploads',
        'libraries.ly.img.video.ly.img.video.upload.label': 'Uploads',
        'libraries.ly.img.audio.ly.img.audio.upload.label': 'Uploads'
      }
    },
    // highlight-translations
    callbacks: {
      onUpload: 'local',
      onSave: (scene) => {
        const element = document.createElement('a');
        const base64Data = btoa(unescape(encodeURIComponent(scene)));
        element.setAttribute(
          'href',
          `data:application/octet-stream;base64,${base64Data}`
        );
        element.setAttribute(
          'download',
          `cesdk-${new Date().toISOString()}.scene`
        );

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      },
      onLoad: 'upload',
      onDownload: 'download',
      onExport: 'download'
    }
  };

  const cesdk = await CreativeEditorSDK.init('#cesdk', config);
  window.cyGlobals = {
    cesdk
  };

  // highlight-default-page-duration
  // Change the default page duration to 10 seconds
  cesdk.engine.block.setFloat('scene/defaultPageDuration', 10)
  // highlight-default-page-duration
};

function paginateAssetResult(
  array,
  { page, perPage } = {
    page: 1,
    perPage: 10
  }
) {
  const pageOffset = (page ?? 0) * perPage;
  const assetsInCurrentPage = array.slice(pageOffset, pageOffset + perPage);
  const total = array.length;
  const currentPage = page;

  const totalFetched = page * perPage + assetsInCurrentPage.length;
  const nextPage = totalFetched < total ? currentPage + 1 : undefined;

  return {
    assets: assetsInCurrentPage,

    total,
    currentPage,
    nextPage
  };
}

function applyQuerySearch(assets, querySearch) {
  return querySearch
    ? assets.filter((asset) => {
        return (asset.label || '')
          .toLowerCase()
          .includes(querySearch.toLowerCase());
      })
    : assets;
}
