import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import SoundstripePlugin from '@imgly/plugin-soundstripe-web';
import { refreshSoundstripeAudioURIs } from '@imgly/plugin-soundstripe-web';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Soundstripe Audio Integration
 *
 * Demonstrates integrating Soundstripe's audio library into CE.SDK:
 * - Adding the Soundstripe plugin
 * - Configuring API authentication (direct or proxy)
 * - Adding Soundstripe to the audio asset library
 * - Automatic URI refresh for expired audio links
 * - Manual URI refresh utility
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default assets and create a basic scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Video' });

    // Create a video scene for demonstrating audio
    await cesdk.createVideoScene();

    // Configure Soundstripe plugin with proxy server
    // The proxy securely handles API authentication without exposing keys in the frontend
    // Set up your own proxy server following:
    // https://docs.soundstripe.com/docs/integrating-soundstripes-content-into-your-application
    const proxyUrl =
      import.meta.env.VITE_SOUNDSTRIPE_PROXY_URL ||
      'https://your-proxy-server.example.com';

    await cesdk.addPlugin(
      SoundstripePlugin({
        baseUrl: proxyUrl
      })
    );

    // Configure localization for the asset library
    cesdk.i18n.setTranslations({
      en: {
        'libraries.soundstripe.label': 'Soundstripe'
      }
    });

    // Configure the asset library UI with a dedicated Soundstripe dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'soundstripe',
      sourceIds: ['ly.img.audio.soundstripe'],
      previewLength: 6,
      gridColumns: 2,
      gridItemHeight: 'auto',
      cardLabel: (assetResult) => assetResult.label
    });

    // Add Soundstripe to the existing Audio asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      sourceIds: ({ currentIds }) => [...currentIds, 'ly.img.audio.soundstripe']
    });

    // Add Soundstripe as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'soundstripe',
        label: 'libraries.soundstripe.label',
        entries: ['soundstripe']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Example: Manual URI refresh utility
    // This is useful if you need to manually refresh expired URIs
    // The plugin handles automatic refresh during scene loading and playback
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleManualRefresh = async () => {
      await refreshSoundstripeAudioURIs(engine, { baseUrl: proxyUrl });
    };

    // You can call this function when needed
    // For example, when loading a scene or before playback
    // handleManualRefresh();
  }
}

export default Example;
