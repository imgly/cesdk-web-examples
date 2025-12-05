import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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

    // Load asset sources with video scene mode
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Video' });

    // Create a video scene to demonstrate video generation
    await cesdk.createVideoScene();

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
    cesdk.ui.setDockOrder(['ly.img.ai.apps.dock', ...cesdk.ui.getDockOrder()]);

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
