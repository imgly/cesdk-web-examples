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
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
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
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

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
