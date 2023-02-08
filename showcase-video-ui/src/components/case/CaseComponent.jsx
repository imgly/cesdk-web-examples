import CreativeEditorSDK, { UserInterfaceElements } from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import {
  addLocalAudioUploadEntry,
  createLocalAudioUploadAssetLibrary
} from './LocalAudioUploadAssetSource';
import {
  addLocalVideoUploadEntry,
  createLocalVideoUploadAssetLibrary
} from './LocalVideoUploadAssetSource';
import { createPageFormatAssetSource } from './PageFormatAssetLibrary';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import { createStaticAudioSource } from './StaticAudioAssetLibrary';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import { createStaticVideoScenesSource } from './StaticVideoScenesAssetLibrary';
import { caseAssetPath } from './util';

const AudioAssets = Object.entries(AUDIO_ASSETS).map(
  ([id, { label, audioPath, thumbnailPath, duration }]) => ({
    id,
    label,
    thumbUri: caseAssetPath(`${thumbnailPath}`),
    meta: {
      uri: caseAssetPath(`/audio/${audioPath}`),
      blockType: '//ly.img.ubq/audio',
      mimeType: 'audio/mp3',
      duration
    },
    size: {
      width: 0,
      height: 0
    },
    context: {
      sourceId: 'ly.img.audio'
    }
  })
);
const VideoSceneAssets = Object.entries(VIDEO_SCENES_ASSETS).map(
  ([id, { label, path, thumbnailPath }]) => ({
    id,
    label,
    thumbUri: caseAssetPath(thumbnailPath),
    meta: {
      uri: caseAssetPath(path)
    },
    size: {
      width: 0,
      height: 0
    },
    context: {
      sourceId: 'exampleVideoScenes'
    }
  })
);

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const cesdkRef = useRef(null);

  useEffect(() => {
    const pageFormatConfig = createPageFormatAssetSource(
      cesdkRef,
      PAGE_FORMAT_ASSETS
    );
    const localAudioUploadConfig = createLocalAudioUploadAssetLibrary(cesdkRef);
    const localVideoUploadConfig = createLocalVideoUploadAssetLibrary(cesdkRef);
    const staticVideoScenesSource = createStaticVideoScenesSource(
      cesdkRef,
      VideoSceneAssets
    );
    /** @type {import("@cesdk/engine").Configuration} */
    const config = {
      theme: 'light',
      initialSceneMode: 'Video',
      initialSceneURL: caseAssetPath('/templates/motion.scene'),
      assetSources: {
        'ly.img.video.upload': localVideoUploadConfig.assetSource,
        'ly.img.audio.upload': localAudioUploadConfig.assetSource,
        pageFormats: pageFormatConfig.assetSource,
        exampleVideoScenes: staticVideoScenesSource
      },
      i18n: {
        en: {
          'libraries.ly.img.upload.ly.img.upload.label': 'Image Uploads',
          'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
          ...pageFormatConfig.i18nEntries,
          ...localAudioUploadConfig.i18nEntries,
          ...localVideoUploadConfig.i18nEntries,
          'libraries.exampleVideoScenes.label': 'Example Videos'
        }
      },
      presets: {
        pageFormats: {
          ...pageFormatConfig.presetEntries
        }
      },
      ui: {
        elements: {
          view: 'default',
          panels: {
            settings: true
          },
          dock: {
            groups: [
              {
                id: 'misc',
                entryIds: ['pageFormats']
              },
              {
                id: 'examples',
                entryIds: ['exampleVideoScenes']
              },
              {
                id: 'ly.img.defaultGroup',
                showOverview: true
              }
            ]
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                addLocalAudioUploadEntry(defaultEntries);
                addLocalVideoUploadEntry(defaultEntries);
                const uploadEntry = defaultEntries.find((entry) => {
                  return entry.id === 'ly.img.upload';
                });
                if (uploadEntry) {
                  uploadEntry.previewLength = 3;
                  uploadEntry.gridColumns = 3;
                  uploadEntry.gridItemHeight = 'square';

                  uploadEntry.previewBackgroundType = 'cover';
                  uploadEntry.gridBackgroundType = 'cover';
                }
                return [
                  ...defaultEntries,
                  pageFormatConfig.insertEntry,
                  {
                    id: 'exampleVideoScenes',
                    sourceIds: ['exampleVideoScenes'],
                    icon: () => caseAssetPath('/static-video-scenes-icon.svg')
                  }
                ];
              }
            },
            replace: {
              entries: (defaultEntries) => {
                addLocalAudioUploadEntry(defaultEntries);
                addLocalVideoUploadEntry(defaultEntries);
                const uploadEntry = defaultEntries.find((entry) => {
                  return entry.id === 'ly.img.upload';
                });
                if (uploadEntry) {
                  uploadEntry.previewLength = 3;
                  uploadEntry.gridColumns = 3;
                  uploadEntry.gridItemHeight = 'square';

                  uploadEntry.previewBackgroundType = 'cover';
                  uploadEntry.gridBackgroundType = 'cover';
                }
                return [...defaultEntries];
              }
            }
          },

          navigation: {
            position: UserInterfaceElements.NavigationPosition.Top,
            action: {
              export: true
            }
          }
        }
      },
      callbacks: {
        onUpload: 'local',
        onDownload: 'download',
        onExport: 'download'
      }
    };


    let cesdk;
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk = instance;
          cesdkRef.current = instance;
          cesdk.engine.editor.setSettingBool('page/title/show', false);

          // Replace the sample audio library with a custom static audio library
          cesdk.engine.asset.removeSource('ly.img.audio');
          cesdk.engine.asset.addSource(
            createStaticAudioSource(cesdk.engine, AudioAssets)
          );

          cesdk.engine.editor.addUndoStep();
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdk_container]);

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div
          className="caseHeader caseHeader--no-margin"
          style={caseHeaderLeft}
        >
          <h3>Video UI for Web</h3>
          <p style={caseHeaderText}>
            Deliver a modern video editing experience to your users running
            entirely in the browser. Arrange videos on a timeline, trim and crop
            to the right duration and format, and overlay audio tracks.
            <br />
            Take advantage of the full suite of CE.SDK features such as filters,
            stickers and text overlay.
            <br />
            <a className="button--ghost" href="https://img.ly/video-sdk">
              Explore more features.
            </a>
          </p>
        </div>
      </div>
      <div style={cesdkWrapperStyle}>
        <div ref={cesdk_container} style={cesdkStyle}></div>
      </div>
    </div>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '2rem',
  color: 'white'
};

const caseHeaderRight = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'end',
  alignSelf: 'flex-start',
  gap: '1rem',
  flexBasis: '35%'
};

const caseHeaderLeft = {
  flexBasis: '65%'
};

const caseHeaderText = {
  maxWidth: '100%'
};

const cesdkStyle = {
  height: '100%',
  width: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  borderRadius: '0.75rem'
};
const cesdkWrapperStyle = {
  marginBottom: '3rem',
  borderRadius: '0.75rem',
  flexGrow: '1',
  minHeight: 0,
  display: 'flex',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem'
};
export default CaseComponent;
