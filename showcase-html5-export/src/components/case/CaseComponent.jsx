'use client';

import {
  BlurAssetSource,
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
import { VideoEditorConfig } from './lib/video-editor/plugin';

import { ExportHtml5PanelPlugin } from './ExportHtml5PanelPlugin';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { caseAssetPath } from './util';

const Html5ExportCESDK = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onUpload: 'local'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    // Add the video editor configuration plugin (provides timeline + animations)
    await instance.addPlugin(new VideoEditorConfig());

    // Asset Source Plugins
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
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );

    // Demo assets
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    // Disable video/audio/caption features not needed for HTML5 animated ads
    instance.feature.disable([
      'ly.img.video.clips',
      'ly.img.video.audio',
      'ly.img.video.addClip',
      'ly.img.video.caption',
      'ly.img.video.controls.split',
      'ly.img.audio.replace',
      'ly.img.volume',
      'ly.img.playbackSpeed',
      'ly.img.trim'
    ]);
    // Remove video/audio entries from dock
    const currentDockOrder = instance.ui.getComponentOrder({
      in: 'ly.img.dock'
    });
    instance.ui.setComponentOrder(
      { in: 'ly.img.dock' },
      currentDockOrder
        .filter(
          (item) =>
            item.key !== 'ly.img.video' &&
            item.key !== 'ly.img.audio' &&
            item.key !== 'ly.img.template'
        )
        .map((item) => {
          if (item.key === 'ly.img.elements' && Array.isArray(item.entries)) {
            return {
              ...item,
              entries: item.entries.filter(
                (entry) =>
                  entry !== 'ly.img.video' &&
                  entry !== 'ly.img.audio' &&
                  entry !== 'ly.img.template'
              )
            };
          }
          return item;
        })
    );

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    await instance.addPlugin(ExportHtml5PanelPlugin());
    // Hide 'Resize' button on the navigation bar
    instance.feature.enable('ly.img.page.resize', false);

    // Load a template scene
    await instance.engine.scene.loadFromArchiveURL(
      caseAssetPath('/html5-banner.zip')
    );

    // Zoom to fit the page in the viewport
    const page = instance.engine.scene.getCurrentPage();
    if (page) {
      instance.engine.scene.zoomToBlock(page, 40, 40, 40, 40);
    }

    // Loading a scene resets the navigation bar, so set the order after
    instance.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.html5-export.navigationBar'
    ]);
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

export default Html5ExportCESDK;
