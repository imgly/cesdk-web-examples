import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type { TranscriptionProvider } from '@imgly/plugin-autocaption-web';

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

import AutocaptionPlugin from '@imgly/plugin-autocaption-web';
import { ElevenLabsScribeV2 } from '@imgly/plugin-autocaption-web/fal-ai';

import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins for the video editor
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
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

    // Register the Auto Caption plugin with the built-in ElevenLabs provider
    await cesdk.addPlugin(
      AutocaptionPlugin({
        provider: ElevenLabsScribeV2({
          // The proxy URL forwards requests to fal.ai with the API key added
          // server-side, keeping the key out of the browser
          proxyUrl: 'https://your-server.com/api/fal-proxy'
        })
      })
    );

    // Create a video scene and add a video clip with spoken audio
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    engine.block.setDuration(page, 30);

    const videoUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoClip = await engine.block.addVideo(videoUrl, 1920, 1080, {
      timeline: { duration: 30, timeOffset: 0 }
    });
    engine.block.appendChild(track, videoClip);
    engine.block.fillParent(track);

    // Example: Implementing a custom transcription provider
    // Use this pattern to connect any speech-to-text service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _customProvider: TranscriptionProvider = {
      name: 'My Custom STT',
      async transcribe(audio: Blob, options?) {
        // Send the audio blob to your speech-to-text service
        const formData = new FormData();
        formData.append('audio', audio, 'audio.mp4');
        if (options?.language) {
          formData.append('language', options.language);
        }

        const response = await fetch('https://your-stt-api.com/transcribe', {
          method: 'POST',
          body: formData,
          signal: options?.abortSignal
        });

        const result = await response.json();
        // Return the transcription as a valid SRT string
        return { srt: result.srt };
      }
    };
    // To use the custom provider instead of ElevenLabs:
    // AutocaptionPlugin({ provider: customProvider })

    // Open the caption panel so the Auto Caption button is visible
    cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
  }
}

export default Example;
