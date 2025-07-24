import AiApps from '@imgly/plugin-ai-apps-web';

export default {
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
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Video' });

    instance.ui.setDockOrder([
      'ly.img.ai/apps.dock',
      ...instance.ui.getDockOrder().filter(({ key }) => {
        return key !== 'ly.img.video.template' && key !== 'ly.img.template';
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

    // Text to sticker
    const text2stickerProvider = getSelectedProvider('text2sticker');
    if (text2stickerProvider.length > 0) {
      providerConfig.text2sticker = text2stickerProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    instance.addPlugin(
      AiApps({
        providers: providerConfig
      })
    );

    // Add AI image history to the default image asset library
    const imageEntry = instance.ui.getAssetLibraryEntry('ly.img.image');
    if (imageEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.image', {
        sourceIds: [
          ...imageEntry.sourceIds,
          'ly.img.ai.image-generation.history'
        ]
      });
    }

    // Add AI video history to the default video asset library
    const videoEntry = instance.ui.getAssetLibraryEntry('ly.img.video');
    if (videoEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.video', {
        sourceIds: [
          ...videoEntry.sourceIds,
          'ly.img.ai.video-generation.history'
        ]
      });
    }

    // Add AI audio history to the default audio asset library
    const audioEntry = instance.ui.getAssetLibraryEntry('ly.img.audio');
    if (audioEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.audio', {
        sourceIds: [
          ...audioEntry.sourceIds,
          'ly.img.ai.audio-generation.history'
        ]
      });
    }

    // Add AI sticker history to the default sticker asset library
    const stickerEntry = instance.ui.getAssetLibraryEntry('ly.img.sticker');
    if (stickerEntry != null) {
      instance.ui.updateAssetLibraryEntry('ly.img.sticker', {
        sourceIds: [
          ...stickerEntry.sourceIds,
          'ly.img.ai.sticker-generation.history'
        ]
      });
    }
  }
};