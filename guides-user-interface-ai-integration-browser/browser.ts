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

// Import providers from individual AI generation packages
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';

// Import middleware utilities
import { uploadMiddleware } from '@imgly/plugin-ai-generation-web';

import packageJson from './package.json';

/**
 * Upload to your image storage server.
 * Replace this mock with your actual storage API call.
 */
async function uploadToYourStorageServer(imageUrl: string) {
  // In production, upload the image to your server:
  // const response = await fetch('https://your-server.com/api/store-image', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     imageUrl,
  //     metadata: { source: 'ai-generation' }
  //   })
  // });
  // return await response.json();

  // Mock: Return a fake response
  return { permanentUrl: imageUrl };
}

/**
 * CE.SDK Plugin: AI Integration Guide
 *
 * Demonstrates how to integrate AI-powered generation capabilities:
 * - Text generation and transformation (Anthropic)
 * - Image generation (fal.ai, OpenAI)
 * - Video generation (fal.ai)
 * - Audio generation (ElevenLabs)
 * - Using middleware for custom processing
 * - Configuring UI integration
 */
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

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }

    // Configure AI Apps dock position
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.apps.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Add AI options to canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
      'ly.img.ai.text.canvasMenu',
      'ly.img.ai.image.canvasMenu',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' })
    ]);

    // Add the AI Apps plugin with all providers
    cesdk.addPlugin(
      AiApps({
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development - remove for production use
        dryRun: true,
        providers: {
          // Text generation and transformation
          text2text: Anthropic.AnthropicProvider({
            proxyUrl: 'http://your-proxy-server.com/api/proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            },
            // Optional: Configure default property values
            properties: {
              temperature: { default: 0.7 },
              maxTokens: { default: 500 }
            }
          }),

          // Image generation - Multiple providers with selection UI
          text2image: [
            FalAiImage.RecraftV3({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Add upload middleware to store generated images on your server
              middleware: [
                uploadMiddleware(async (output) => {
                  // Upload the generated image to your server
                  const result = await uploadToYourStorageServer(output.url);

                  // Return the output with your server's URL
                  return {
                    ...output,
                    url: result.permanentUrl
                  };
                })
              ]
            }),
            // Alternative with icon style support
            FalAiImage.Recraft20b({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              },
              // Configure dynamic defaults based on style type
              properties: {
                style: { default: 'broken_line' },
                image_size: { default: 'square_hd' }
              }
            }),
            // Additional image provider for user selection
            OpenAiImage.GptImage1.Text2Image({
              proxyUrl: 'http://your-proxy-server.com/api/proxy',
              headers: {
                'x-api-key': 'your-key',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],

          // Image-to-image transformation
          image2image: FalAiImage.GeminiFlashEdit({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Video generation - Multiple providers
          text2video: [
            FalAiVideo.MinimaxVideo01Live({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            }),
            FalAiVideo.PixverseV35TextToVideo({
              proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
              headers: {
                'x-client-version': '1.0.0',
                'x-request-source': 'cesdk-tutorial'
              }
            })
          ],
          image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
            proxyUrl: 'https://your-server.com/api/fal-ai-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),

          // Audio generation
          text2speech: Elevenlabs.ElevenMultilingualV2({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),
          text2sound: Elevenlabs.ElevenSoundEffects({
            proxyUrl: 'https://your-server.com/api/elevenlabs-proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          })
        }
      })
    );

    // Control AI features with Feature API
    // Disable specific quick actions
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.quickAction.editImage',
      false
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-text-generation-web.quickAction.translate',
      false
    );

    // Control input types for image/video generation
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromText',
      true
    );
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fromImage',
      false
    );

    // Hide provider selection dropdowns
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.providerSelect',
      false
    );

    // Control style groups for specific providers
    cesdk.feature.enable(
      'ly.img.plugin-ai-image-generation-web.fal-ai/recraft-v3.style.vector',
      false
    );

    console.log('AI integration guide initialized.');
  }
}

export default Example;
