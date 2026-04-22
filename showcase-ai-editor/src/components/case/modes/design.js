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
import { DesignEditorConfig } from '../lib/design-editor/plugin';

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
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

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
        include: ['ly.img.image.upload']
      })
    );

    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
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

    await instance.addPlugin(
      AiApps({
        providers: providerConfig
      })
    );

    // Add AI image history to the default image asset library
    const imageEntry = instance.ui.getAssetLibraryEntry('ly.img.image');
    if (imageEntry != null) {
      const imageSourceIds =
        typeof imageEntry.sourceIds === 'function'
          ? imageEntry.sourceIds({ engine: instance.engine, cesdk: instance })
          : imageEntry.sourceIds ?? [];
      instance.ui.updateAssetLibraryEntry('ly.img.image', {
        sourceIds: [...imageSourceIds, 'ly.img.ai.image-generation.history']
      });
    }
  }
};

export default designMode;
