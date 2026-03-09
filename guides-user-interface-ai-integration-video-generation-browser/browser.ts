import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import { VideoEditorConfig } from './video-editor/plugin';
import AiApps from '@imgly/plugin-ai-apps-web';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    // Configure the AI video generation plugin
    // NOTE: In production, provide a secure proxy URL that forwards
    // requests to fal.ai API with your API key
    const proxyUrl = 'https://your-proxy-server.com/api/fal-ai';

    // Configure video generation with all available providers using AiApps
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2video: [
            FalAiVideo.MinimaxVideo01Live({ proxyUrl }),
            FalAiVideo.ByteDanceSeedanceV1ProTextToVideo({ proxyUrl }),
            FalAiVideo.KlingVideoV21MasterTextToVideo({ proxyUrl }),
            FalAiVideo.PixverseV35TextToVideo({ proxyUrl }),
            FalAiVideo.Veo31FastTextToVideo({ proxyUrl }),
            FalAiVideo.Veo31TextToVideo({ proxyUrl }),
            FalAiVideo.Veo3TextToVideo({ proxyUrl })
          ] as any,
          image2video: [
            FalAiVideo.MinimaxVideo01LiveImageToVideo({ proxyUrl }),
            FalAiVideo.ByteDanceSeedanceV1ProImageToVideo({ proxyUrl }),
            FalAiVideo.KlingVideoV21MasterImageToVideo({ proxyUrl }),
            FalAiVideo.MinimaxHailuo02StandardImageToVideo({ proxyUrl }),
            FalAiVideo.Veo31FastImageToVideo({ proxyUrl }),
            FalAiVideo.Veo31ImageToVideo({ proxyUrl }),
            FalAiVideo.Veo31FastFirstLastFrameToVideo({ proxyUrl }),
            FalAiVideo.Veo31FirstLastFrameToVideo({ proxyUrl })
          ] as any
        },
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development
        dryRun: true
      })
    );

    // Reorder dock to show AI Apps button prominently
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Customize UI labels for AI video generation features
    // This demonstrates how to customize the i18n system
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-video-generation-web.fal-ai/minimax/video-01-live.property.prompt':
          '🎬 Describe Your Video'
      }
    });

    // Alternative: Configure with single video generation provider
    /*
    await cesdk.addPlugin(
      VideoGeneration({
        text2video: FalAiVideo.MinimaxVideo01Live({
          proxyUrl,
          properties: {
            prompt_optimizer: { default: true }
          }
        } as any),
        image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
          proxyUrl
        } as any),
        dryRun: true
      } as any)
    );
    */

    // Open the AI Apps panel to make the video generation features visible

    cesdk.ui.openPanel('ly.img.ai.apps');
  }
}

export default Example;
