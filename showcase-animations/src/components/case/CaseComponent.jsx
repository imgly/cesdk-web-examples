'use client';

import { UserInterfaceElements } from '@cesdk/cesdk-js';
import { usePathname } from 'next/navigation';
import AUDIO_ASSETS from './StaticAudioAssets.json';
import VIDEO_SCENES_ASSETS from './StaticVideoScenesAssets.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
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
    
    instance.i18n.setTranslations({
      en: {
        'libraries.ly.img.audio.ly.img.audio.label': 'Soundstripe',
        'libraries.ly.img.video.scene.label': 'Example Templates'
      }
    });

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
      sourceIds: ['ly.img.video.scene'],
      gridColumns: 2
    });

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    // Remove "Customize Editor" button
    instance.ui.setCanvasBarOrder(
      ['ly.img.spacer', 'ly.img.page.add.canvasBar', 'ly.img.spacer'],
      'bottom'
    );
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
        persistSelectedTemplateToURL(asset.id);
      }
    );

    loadAssetSourceFromContentJSON(
      engine,
      AUDIO_ASSETS,
      caseAssetPath('/audio')
    );

    await instance
      .loadFromURL(
        caseAssetPath(`/templates/${loadSelectedTemplateFromURL()}.scene`)
      )
      .catch(() => {
        // Fallback to Surf School template if the selected template fails to load, e.g due to 404
        instance.loadFromURL(caseAssetPath(`/templates/lunar-cosmetics.scene`));
      });

    // open animation panel on initialization and scene change
    openAnimationPanel(instance);
    const unsubscribe = engine.scene.onActiveChanged(() => {
      openAnimationPanel(instance);
    });
    return () => unsubscribe();
  }, []);

  // Needed to set the height of the editor to 100% in the fullscreen (standalone) mode
  const pathname = usePathname();

  return (
    <div
      className="cesdkWrapperStyle"
      style={{
        minHeight: pathname.endsWith('standalone/') ? 'auto' : '820px'
      }}
    >
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
  return url.searchParams.get('template') || 'lunar-cosmetics';
}

// Select the first block on the background clip for animation panel
async function openAnimationPanel(instance) {
  const engine = instance.engine;
  for (let block of engine.block.findAll()) {
    // get background clips
    if (engine.block.isAlwaysOnBottom(block)) {
      for (let child of engine.block.getChildren(block)) {
        // select the first one that is visible
        if (engine.block.isVisibleAtCurrentPlaybackTime(child)) {
          engine.block.select(child);
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('//ly.img.panel/inspector/animation');
          break;
        }
      }
      break;
    }
  }
}

export default CaseComponent;
