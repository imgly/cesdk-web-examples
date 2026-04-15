import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import { DesignEditorConfig } from './design-editor/plugin';
import ImageGeneration from '@imgly/plugin-ai-image-generation-web';
import { GatewayProvider as ImageGatewayProvider } from '@imgly/plugin-ai-image-generation-web/gateway';
import TextGeneration from '@imgly/plugin-ai-text-generation-web';
import { GatewayProvider as TextGatewayProvider } from '@imgly/plugin-ai-text-generation-web/gateway';
import VideoGeneration from '@imgly/plugin-ai-video-generation-web';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';
import AudioGeneration from '@imgly/plugin-ai-audio-generation-web';
import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
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
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a token action that CE.SDK calls before each generation request.
    // In production, this calls your backend endpoint to mint a short-lived JWT.
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      const res = await fetch('/api/ai/token', { method: 'POST' });
      const { token } = await res.json();
      return token;
    });

    // Alternative: use a direct API key for development (not for production)
    /*
    cesdk.actions.register('ly.img.ai.getToken', async () => {
      return { dangerouslyExposeApiKey: 'sk_your_api_key' };
    });
    */

    // All gateway providers share this configuration.
    // An empty object uses sensible defaults (gateway URL, token action ID, etc.).
    const gatewayConfig = {
      debug: true
    };

    // Configure image generation with text-to-image and image-to-image providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
          image2image: ImageGatewayProvider(
            'fal-ai/flux-kontext/edit',
            gatewayConfig
          )
        }
      })
    );

    // Configure text generation with streaming output
    await cesdk.addPlugin(
      TextGeneration({
        providers: {
          text2text: TextGatewayProvider('openai/gpt-4o', gatewayConfig)
        }
      })
    );

    // Configure video generation with text-to-video and image-to-video providers
    await cesdk.addPlugin(
      VideoGeneration({
        providers: {
          text2video: VideoGatewayProvider('fal-ai/veo3.1', gatewayConfig),
          image2video: VideoGatewayProvider(
            'fal-ai/kling-video/v2.1/standard/image-to-video',
            gatewayConfig
          )
        }
      })
    );

    // Configure audio generation with text-to-speech
    await cesdk.addPlugin(
      AudioGeneration({
        providers: {
          text2speech: AudioGatewayProvider(
            'elevenlabs/multilingual-v2',
            gatewayConfig
          )
        }
      })
    );

    // You can also pass arrays of providers to offer model selection in the UI
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: [
            ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
            ImageGatewayProvider('fal-ai/recraft-v3', gatewayConfig)
          ]
        }
      })
    );
    */

    // Add middleware for logging or rate limiting
    /*
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: ImageGatewayProvider('fal-ai/flux/dev', gatewayConfig),
        },
        middleware: [loggingMiddleware(), rateLimitMiddleware({ maxRequests: 10, timeWindow: 60000 })],
      })
    );
    */

    // Customize provider labels in the UI
    /*
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-image-generation-web.gateway/fal-ai/flux/dev.defaults.property.prompt':
          'Describe your image',
      },
    });
    */
  }
}

export default Example;
