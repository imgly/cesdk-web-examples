'use client';

import { UserInterfaceElements } from '@cesdk/cesdk-js';
import { formatAssetsToPresets } from './PageFormatAssetLibrary';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';
import RemoteAssetSourcePlugin from '@imgly/plugin-remote-asset-source-web';

let GIPHY_API_ENDPOINT = ''; // INSERT YOUR GIPHY API ENDPOINT HERE


function getGiphyEndpoint() {
  if (GIPHY_API_ENDPOINT === '' && !window.giphyWarning) {
    window.giphyWarning = true;
    alert(`Please provide your Giphy api endpoint.`);
  }
  return GIPHY_API_ENDPOINT;
}

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      i18n: {
        en: {
          'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
          'libraries.ly.img.video.scene.label': 'Example Templates'
        }
      },
      ui: {
        pagePresetLibraries: formatAssetsToPresets(PAGE_FORMAT_ASSETS),
        elements: {
          view: 'default',
          panels: {
            settings: true
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

    instance.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'examples',
        label: 'libraries.ly.img.video.scene.label',
        icon: () => caseAssetPath('/static-video-scenes-icon.svg'),
        entries: ['ly.img.video.scene']
      },
      'ly.img.separator',
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => !['ly.img.video.template'].includes(key))
    ]);

    instance.ui.addAssetLibraryEntry({
      id: 'ly.img.video.scene',
      sourceIds: ['ly.img.video.scene']
    });

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);

    instance.addPlugin(
      RemoteAssetSourcePlugin({
        baseUrl: getGiphyEndpoint()
      })
    );

    instance.ui.updateAssetLibraryEntry('ly.img.sticker', {
      sourceIds: [
        ...instance.ui.getAssetLibraryEntry('ly.img.sticker').sourceIds,
        'ly.img.video.giphy.sticker'
      ],
      gridColumns: 2
    });


    const engine = instance.engine;
    engine.editor.setSettingBool('page/title/show', false);

    loadAssetSourceFromContentJSON(
      engine,
      VIDEO_SCENES_ASSETS,
      caseAssetPath('/templates'),
      async (asset) => {
        // Stop the current playing scene before loading a new one to prevent errors
        const page = engine.scene.getCurrentPage();
        if (engine.block.isPlaying(page)) {
          engine.block.setPlaying(page, false);
        }
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

    // Load a different template based on the URL
    const templateAsset =
      VIDEO_SCENES_ASSETS.assets.find(
        (a) => a.id === loadSelectedTemplateFromURL()
      ) ?? VIDEO_SCENES_ASSETS.assets[0];
    await engine.scene.loadFromURL(templateAsset.meta.uri);
  }, []);

  return (
    <div className="cesdkWrapperStyle" style={{ minHeight: '820px' }}>
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

function persistSelectedTemplateToURL(assetId) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', assetId);
  window.history.pushState({}, '', url);
}
function loadSelectedTemplateFromURL() {
  const url = new URL(window.location.href);
  return url.searchParams.get('template');
}
export default CaseComponent;
