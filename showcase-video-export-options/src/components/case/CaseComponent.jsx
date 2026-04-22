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
import { VideoEditorConfig } from './lib/video-editor/plugin';

import { ExportVideoPanelPlugin } from './ExportVideoPanelPlugin';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const ExportOptionsCESDK = () => {
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
    await instance.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.video.*',
          'ly.img.audio.*'
        ]
      })
    );

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    await instance.addPlugin(ExportVideoPanelPlugin());
    // Hide 'Resize' button on the navigation bar
    instance.feature.enable('ly.img.page.resize', false);
    instance.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',

      'ly.img.spacer',

      'ly.img.zoom.navigationBar',
      'ly.img.export-options.navigationBar'
    ]);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/video-export-options/example-video-motion.scene`
    );
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

export default ExportOptionsCESDK;
