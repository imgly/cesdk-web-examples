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
import { VideoEditorConfig } from '../lib/video-editor/plugin';

import AiApps from '@imgly/plugin-ai-apps-web';

const videoMode = {
  name: 'Video',
  sceneMode: 'Video',
  cesdkConfig: {
    featureFlags: {
      archiveSceneEnabled: true,
      dangerouslyDisableVideoSupportCheck: false
    },
    callbacks: {
      onUpload: 'local',
      onExport: 'download'
    },
    ui: {
      elements: {
        navigation: {
          action: {
            export: true
          }
        }
      }
    }
  },
  initialize: async (instance, modeContext, createMiddleware) => {
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
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
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

    // Use setComponentOrder (new API) instead of setDockOrder (deprecated)
    const currentDockOrder = instance.ui.getComponentOrder({ in: 'ly.img.dock' });
    instance.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai/apps.dock',
      ...currentDockOrder.filter((item) => {
        return item.key !== 'ly.img.templates';
      })
    ]);

    instance.ui.setCanvasMenuOrder([
      'ly.img.ai.text.canvasMenu',
      'ly.img.ai.image.canvasMenu',
      'ly.img.separator',
      ...instance.ui.getCanvasMenuOrder()
    ]);

    instance.feature.enable('ly.img.preview', false);
    instance.feature.enable('ly.img.placeholder', false);

    await instance.engine.scene.loadFromArchiveURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-editor/ai_editor_video.archive`
    );

    // Build provider configuration based on selected providers
    const providerConfig = {};

    const getSelectedProvider = (category) => {
      return (
        modeContext?.providers[category]?.providers?.filter(
          (p) => p.selected && p.provider != null
        ) || []
      );
    };

    let middlewares = {};
    if (createMiddleware) {
      middlewares = createMiddleware(instance);
    }

    // Text to text
    const text2textProvider = getSelectedProvider('text2text');
    if (text2textProvider.length > 0) {
      providerConfig.text2text = text2textProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Text to image
    const text2imageProvider = getSelectedProvider('text2image');
    if (text2imageProvider.length > 0) {
      providerConfig.text2image = text2imageProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Image to image
    const image2imageProvider = getSelectedProvider('image2image');
    if (image2imageProvider.length > 0) {
      providerConfig.image2image = image2imageProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Text to video
    const text2videoProvider = getSelectedProvider('text2video');
    if (text2videoProvider.length > 0) {
      providerConfig.text2video = text2videoProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Image to video
    const image2videoProvider = getSelectedProvider('image2video');
    if (image2videoProvider.length > 0) {
      providerConfig.image2video = image2videoProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Text to speech
    const text2speechProvider = getSelectedProvider('text2speech');
    if (text2speechProvider.length > 0) {
      providerConfig.text2speech = text2speechProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    // Text to sound
    const text2soundProvider = getSelectedProvider('text2sound');
    if (text2soundProvider.length > 0) {
      providerConfig.text2sound = text2soundProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    await instance.addPlugin(
      AiApps({
        providers: providerConfig
      })
    );

    // Helper to resolve sourceIds (can be array or function in v1.69.0+)
    const resolveSourceIds = (entry) =>
      typeof entry?.sourceIds === 'function'
        ? entry.sourceIds({ engine: instance.engine, cesdk: instance })
        : entry?.sourceIds ?? [];

    // Add AI image history to the default image asset library
    const imageEntry = instance.ui.getAssetLibraryEntry('ly.img.image');
    if (imageEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.image', {
        sourceIds: [
          ...resolveSourceIds(imageEntry),
          'ly.img.ai.image-generation.history'
        ]
      });
    }

    // Add AI video history to the default video asset library
    const videoEntry = instance.ui.getAssetLibraryEntry('ly.img.video');
    if (videoEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.video', {
        sourceIds: [
          ...resolveSourceIds(videoEntry),
          'ly.img.ai.video-generation.history'
        ]
      });
    }

    // Add AI audio history to the default audio asset library
    const audioEntry = instance.ui.getAssetLibraryEntry('ly.img.audio');
    if (audioEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.audio', {
        sourceIds: [
          ...resolveSourceIds(audioEntry),
          'ly.img.ai.audio-generation.history'
        ]
      });
    }
  }
};

export default videoMode;
