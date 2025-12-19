import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });

    // Create a design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Configure the AI image generation plugin
    // NOTE: In production, provide a secure proxy URL that forwards
    // requests to fal.ai or OpenAI API with your API key
    const proxyUrl = 'https://your-proxy-server.com/api';

    // Configure image generation with all available providers using AiApps
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2image: [
            FalAiImage.RecraftV3({ proxyUrl }),
            FalAiImage.Recraft20b({ proxyUrl }),
            FalAiImage.IdeogramV3({ proxyUrl }),
            FalAiImage.GeminiFlash25({ proxyUrl }),
            FalAiImage.NanoBanana({ proxyUrl }),
            FalAiImage.SeedreamV4({ proxyUrl }),
            FalAiImage.FluxProKontextEdit({ proxyUrl }),
            FalAiImage.FluxProKontextMaxEdit({ proxyUrl }),
            OpenAiImage.GptImage1.Text2Image({ proxyUrl }),
          ],
          image2image: [
            FalAiImage.GeminiFlashEdit({ proxyUrl }),
            FalAiImage.Gemini25FlashImageEdit({ proxyUrl }),
            FalAiImage.IdeogramV3Remix({ proxyUrl }),
            FalAiImage.QwenImageEdit({ proxyUrl }),
            FalAiImage.NanoBananaEdit({ proxyUrl }),
            FalAiImage.SeedreamV4Edit({ proxyUrl }),
            OpenAiImage.GptImage1.Image2Image({ proxyUrl }),
          ],
        },
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development
        dryRun: true
      })
    );

    // Reorder dock to show AI Apps button prominently
    cesdk.ui.setDockOrder([
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getDockOrder()
    ]);

    // Alternative: Configure with single provider
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            headers: { 'x-client-version': '1.0.0' }
          }) as any
        },
        dryRun: true
      })
    );
    */

    // Customize generation parameters with default values
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            properties: {
              style: { default: 'realistic_image/natural_light' },
              image_size: { default: 'square_hd' },
            },
          }) as any,
        },
      })
    );
    */

    // Control output mode (vector vs raster) via style selection
    // RecraftV3 supports both raster (realistic_image) and vector output
    // To restrict to vector only:
    /*
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.image',
      false
    );
    */

    // Configure artistic styles for different visual outputs
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            properties: {
              style: {
                default: 'digital_illustration/pixel_art',
              },
            },
          }) as any,
        },
      })
    );
    */

    // Control which features are visible in the UI
    /*
    // Hide provider selection when using single provider
    cesdk.feature.enable('ly.img.plugin-ai-image-generation-web.providerSelect', false);

    // Disable specific style groups
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );
    */

    // Customize UI labels and translations
    /*
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
          'Describe your image',
        'ly.img.plugin-ai-generation-web.property.prompt': 'AI Prompt',
      },
      de: {
        'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.property.prompt':
          'Beschreiben Sie Ihr Bild',
      },
    });
    */

    // Implement middleware for logging or rate limiting
    /*
    import {
      loggingMiddleware,
      rateLimitMiddleware,
    } from '@imgly/plugin-ai-generation-web';

    const logging = loggingMiddleware();
    const rateLimit = rateLimitMiddleware({
      maxRequests: 10,
      timeWindow: 60000, // 1 minute
    });

    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({ proxyUrl }) as any,
        },
        middleware: [logging, rateLimit],
      })
    );
    */

    // Test without making actual API calls
    /*
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: FalAiImage.RecraftV3({
            proxyUrl,
            debug: true,
            dryRun: true,
          }) as any,
        },
      })
    );
    */

    // Generated images are automatically added to provider-specific history sources:
    // - fal-ai/recraft-v3.history
    // - fal-ai/ideogram/v3.history
    // - open-ai/gpt-image-1/text2image.history
    // Access them through the asset library or programmatically:
    /*
    const assets = engine.asset.findAllSources();
    const historySource = assets.find(id =>
      engine.asset.getName(id) === 'fal-ai/recraft-v3.history'
    );
    if (historySource) {
      const results = await engine.asset.findAssets(historySource);
      console.log('Generated images:', results);
    }
    */

    // Open the AI Apps panel to make the image generation features visible
    cesdk.ui.openPanel('ly.img.ai.apps');
  }
}

export default Example;
