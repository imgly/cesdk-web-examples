import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
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

    // Create a video scene to demonstrate audio generation
    await cesdk.createVideoScene();

    // Configure the audio generation plugin
    // NOTE: In production, provide a secure proxy URL that forwards
    // requests to ElevenLabs API with your API key
    const proxyUrl = 'https://your-proxy-server.com/api/elevenlabs';

    // Configure audio generation with text-to-speech and sound effects
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2speech: Elevenlabs.ElevenMultilingualV2({
            proxyUrl,
            properties: {
              voice_id: 'pNInz6obpgDQGcFmaJgB' // Default voice
            }
          } as any),
          text2sound: Elevenlabs.ElevenSoundEffects({
            proxyUrl
          } as any)
        },
        // IMPORTANT: dryRun mode simulates generation without API calls
        dryRun: true
      })
    );

    // Reorder dock to show AI Apps button prominently
    cesdk.ui.setDockOrder(['ly.img.ai.apps.dock', ...cesdk.ui.getDockOrder()]);

    // Add AI audio generation history to the audio asset library
    const audioEntry = cesdk.ui.getAssetLibraryEntry('ly.img.audio');
    if (audioEntry != null) {
      const existingSourceIds = Array.isArray(audioEntry.sourceIds)
        ? audioEntry.sourceIds
        : audioEntry.sourceIds({} as any);

      cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
        sourceIds: [...existingSourceIds, 'ly.img.ai.audio-generation.history']
      });
    }

    // Open the AI Apps panel to make the audio generation features visible
    cesdk.ui.openPanel('ly.img.ai.apps');
  }
}

export default Example;
