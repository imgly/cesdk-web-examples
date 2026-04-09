'use client';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { UserInterfaceElements } from '@cesdk/cesdk-js';
import { VideoEditorConfig } from './lib/video-editor/plugin';

import RemoteAssetSourcePlugin from '@imgly/plugin-remote-asset-source-web';
import { formatAssetsToPresets } from './PageFormatAssetLibrary';
import PAGE_FORMAT_ASSETS from './PageFormatAssets.json';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

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
    // Add the video editor configuration plugin first
    await instance.addPlugin(new VideoEditorConfig());

    // Asset Source Plugins (replaces addDefaultAssetSources)
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(new CaptionPresetsAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );

    // Demo assets (replaces addDemoAssetSources)
    // We want to replace the demo audio assets with our own
    await instance.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.video.*'
        ]
      })
    );

    instance.i18n.setTranslations({
      en: {
        'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
        'libraries.ly.img.video.scene.label': 'Example Templates'
      }
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
        .filter(({ key }) => !['ly.img.templates'].includes(key))
    ]);

    instance.ui.addAssetLibraryEntry({
      id: 'ly.img.video.scene',
      sourceIds: ['ly.img.video.scene']
    });

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);

    await instance.addPlugin(
      RemoteAssetSourcePlugin({
        baseUrl: getGiphyEndpoint()
      })
    );

    const stickerEntry = instance.ui.getAssetLibraryEntry('ly.img.sticker');
    const stickerSourceIds =
      typeof stickerEntry?.sourceIds === 'function'
        ? stickerEntry.sourceIds({ engine: instance.engine, cesdk: instance })
        : (stickerEntry?.sourceIds ?? []);
    instance.ui.updateAssetLibraryEntry('ly.img.sticker', {
      sourceIds: [...stickerSourceIds, 'ly.img.video.giphy.sticker'],
      gridColumns: 2
    });


    const engine = instance.engine;
    engine.editor.setSetting('page/title/show', false);

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
        // Zoom auto-fit to page
        instance.actions.run('zoom.toPage', {
          autoFit: true
        });
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
    // Zoom auto-fit to page
    instance.actions.run('zoom.toPage', {
      autoFit: true
    });
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
