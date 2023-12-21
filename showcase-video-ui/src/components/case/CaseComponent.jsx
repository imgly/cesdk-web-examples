import CreativeEditorSDK, { UserInterfaceElements } from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import { createApplyFormatAsset } from './createApplyFormatAsset';
import { createDefaultApplyAssetScene } from './defaultApplyAssetScene';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import {
  formatAssetsToPresets,
  pageFormatI18n,
  PAGE_FORMATS_INSERT_ENTRY
} from './PageFormatAssetLibrary';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import { caseAssetPath } from './util';

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const cesdkRef = useRef(null);

  useEffect(() => {
    /** @type {import("@cesdk/engine").Configuration} */
    const config = {
      theme: 'light',
      license: process.env.REACT_APP_LICENSE,
      i18n: {
        en: {
          'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
          ...pageFormatI18n(PAGE_FORMAT_ASSETS.assets),
          'libraries.ly.img.video.templates.label': 'Example Templates'
        }
      },
      ui: {
        pageFormats: formatAssetsToPresets(PAGE_FORMAT_ASSETS),
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
                entryIds: ['ly.img.video.templates']
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
                return [
                  ...defaultEntries,
                  PAGE_FORMATS_INSERT_ENTRY,
                  {
                    id: 'ly.img.video.templates',
                    sourceIds: ['ly.img.video.templates'],
                    icon: () => caseAssetPath('/static-video-scenes-icon.svg')
                  }
                ];
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
      CreativeEditorSDK.create(cesdk_container.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: 'Video',
            // We want to replace the demo audio assets with our own
            excludeAssetSourceIds: ['ly.img.audio']
          });
          cesdk = instance;
          cesdkRef.current = instance;
          cesdk.engine.editor.setSettingBool('page/title/show', false);

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            VIDEO_SCENES_ASSETS,
            caseAssetPath('/templates'),
            createDefaultApplyAssetScene(cesdk.engine)
          );

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            AUDIO_ASSETS,
            caseAssetPath('/audio')
          );

          loadAssetSourceFromContentJSON(
            cesdk.engine,
            PAGE_FORMAT_ASSETS,
            caseAssetPath('/page-formats'),
            createApplyFormatAsset(cesdk.engine)
          );
          cesdk.loadFromURL(caseAssetPath('/templates/motion.scene'));
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
    <div style={cesdkWrapperStyle}>
      <div ref={cesdk_container} style={cesdkStyle}></div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const cesdkWrapperStyle = {
  position: 'relative',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)',
  minHeight: '740px'
};

export default CaseComponent;
