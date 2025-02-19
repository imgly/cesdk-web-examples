import CreativeEditorSDK, { UserInterfaceElements } from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import { createApplyFormatAsset } from './createApplyFormatAsset';
import { createDefaultApplyAssetScene } from './defaultApplyAssetScene';
import loadAssetSourceFromContentJSON from './loadAssetSourceFromContentJSON';
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
      initialSceneMode: 'Video',
      initialSceneURL: caseAssetPath('/templates/motion.scene'),
      i18n: {
        en: {
          'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
          ...pageFormatI18n(PAGE_FORMAT_ASSETS.assets),
          'libraries.ly.img.video.templates.label': 'Example Videos'
        }
      },
      presets: {
        pageFormats: formatAssetsToPresets(PAGE_FORMAT_ASSETS)
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
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
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
