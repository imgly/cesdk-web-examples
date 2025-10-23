import AiApps from '@imgly/plugin-ai-apps-web';

const designMode = {
  name: 'Design',
  sceneMode: 'Design',
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
    await instance.addDemoAssetSources({ sceneMode: 'Design' });

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
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-editor/ai_editor_design_v3.archive`
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

    // Text to sticker
    const text2stickerProvider = getSelectedProvider('text2sticker');
    if (text2stickerProvider.length > 0) {
      providerConfig.text2sticker = text2stickerProvider.map((p) =>
        p.provider(middlewares)
      );
    }

    await instance.addPlugin(
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

export default designMode;
