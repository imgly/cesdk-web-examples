'use client';

import { UserInterfaceElements } from '@cesdk/cesdk-js';
import {
  PAGE_FORMATS_INSERT_ENTRY,
  formatAssetsToPresets,
  pageFormatI18n
} from './PageFormatAssetLibrary';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import { createApplyFormatAsset } from './createApplyFormatAsset';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      i18n: {
        en: {
          'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
          ...pageFormatI18n(PAGE_FORMAT_ASSETS.assets),
          'libraries.ly.img.video.scene.label': 'Example Templates'
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
                entryIds: ['ly.img.video.scene']
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
                  ...defaultEntries.filter(
                    ({ id }) => !['ly.img.video.template'].includes(id)
                  ),
                  PAGE_FORMATS_INSERT_ENTRY,
                  {
                    id: 'ly.img.video.scene',
                    sourceIds: ['ly.img.video.scene'],
                    icon: () => caseAssetPath('/static-video-scenes-icon.svg'),
                    gridColumns: 2
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
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({
      sceneMode: 'Video',
      // We want to replace the demo audio assets with our own
      excludeAssetSourceIds: ['ly.img.audio', 'ly.img.video.template']
    });

    const engine = instance.engine;
    engine.editor.setSettingBool('page/title/show', false);

    loadAssetSourceFromContentJSON(
      engine,
      VIDEO_SCENES_ASSETS,
      caseAssetPath('/templates'),
      async (asset) => {
        if (!asset.meta || !asset.meta.uri)
          throw new Error('Asset does not have a uri');
        await engine.scene.loadFromURL(asset.meta.uri);
        persistSelectedTemplateToURL(asset.id);
      }
    );

    loadAssetSourceFromContentJSON(
      engine,
      AUDIO_ASSETS,
      caseAssetPath('/audio')
    );

    loadAssetSourceFromContentJSON(
      engine,
      PAGE_FORMAT_ASSETS,
      caseAssetPath('/page-formats'),
      createApplyFormatAsset(engine)
    );

    instance
      .loadFromURL(
        caseAssetPath(`/templates/${loadSelectedTemplateFromURL()}.scene`)
      )
      .catch(() => {
        // Fallback to motion template if the selected template fails to load, e.g due to 404
        instance.loadFromURL(caseAssetPath(`/templates/motion.scene`));
      });
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

function persistSelectedTemplateToURL(templateName) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', templateName);
  window.history.pushState({}, '', url);
}
function loadSelectedTemplateFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get('template') || 'motion';
}

export default CaseComponent;
