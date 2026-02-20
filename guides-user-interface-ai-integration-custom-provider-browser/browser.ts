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
import {
  CommonProviderConfiguration,
  ImageOutput,
  Provider,
  loggingMiddleware,
  uploadMiddleware
} from '@imgly/plugin-ai-generation-web';
import ImageGeneration from '@imgly/plugin-ai-image-generation-web';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import packageJson from './package.json';
import apiSchema from './myApiSchema.json';

// Define your input type based on your schema
interface MyProviderInput {
  prompt: string;
  width: number;
  height: number;
  style: string;
  image_url?: string; // For image-to-image operations
}

// Define provider configuration interface extending CommonProviderConfiguration
interface MyProviderConfiguration
  extends CommonProviderConfiguration<MyProviderInput, ImageOutput> {
  // Add any provider-specific configuration here
  customApiKey?: string;
}

// Mock API function that simulates image generation
// In production, this would be replaced with actual API calls
async function mockGenerateImage(
  input: MyProviderInput,
  _abortSignal?: AbortSignal
): Promise<{ imageUrl: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return real demo image URLs based on the style
  const sampleImages: Record<string, string> = {
    photorealistic:
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/images/sample_1.jpg',
    cartoon:
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/images/sample_2.jpg',
    sketch:
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/images/sample_3.jpg',
    painting:
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/images/sample_4.jpg'
  };

  return {
    imageUrl: sampleImages[input.style] || sampleImages.photorealistic
  };
}

// Create a function that returns your provider
export function MyImageProvider(
  _config: MyProviderConfiguration
): (context: {
  cesdk: CreativeEditorSDK;
}) => Promise<Provider<'image', MyProviderInput, ImageOutput>> {
  // Return a function that returns the provider
  return async ({ cesdk: _cesdk }) => {
    // Create and return the provider
    const provider: Provider<'image', MyProviderInput, ImageOutput> = {
      // Unique identifier for your provider
      id: 'my-image-provider',

      // Define output type as 'image'
      kind: 'image',

      // Initialize your provider
      initialize: async () => {
        console.log('Initializing my image provider');
        // Any setup needed (e.g., API client initialization)
      },

      // Define input panel and UI using schema
      input: {
        panel: {
          type: 'schema',
          document: apiSchema, // Your OpenAPI schema
          inputReference: '#/components/schemas/GenerationInput', // Reference to your input schema
          userFlow: 'placeholder', // Creates a block first, then updates it with the generated content
          orderExtensionKeyword: 'x-order-properties', // Used to control property display order

          // Convert API input to block parameters
          getBlockInput: async (input) => ({
            image: {
              width: input.width || 512,
              height: input.height || 512,
              label: `AI: ${input.prompt?.substring(0, 20)}...`
            }
          })
        },

        // Add quick actions for canvas menu
        quickActions: {
          supported: {
            // Map quick action IDs to provider input transformations
            'ly.img.editImage': {
              mapInput: (quickActionInput) => ({
                prompt: quickActionInput.prompt,
                image_url: quickActionInput.uri,
                width: 512,
                height: 512,
                style: 'photorealistic'
              })
            },
            'ly.img.swapBackground': {
              mapInput: (quickActionInput) => ({
                prompt: quickActionInput.prompt,
                image_url: quickActionInput.uri,
                width: 512,
                height: 512,
                style: 'photorealistic'
              })
            },
            'ly.img.createVariant': {
              mapInput: (quickActionInput) => ({
                prompt: quickActionInput.prompt,
                image_url: quickActionInput.uri,
                width: 512,
                height: 512,
                style: 'photorealistic'
              })
            },
            'ly.img.styleTransfer': {
              mapInput: (quickActionInput) => ({
                prompt: quickActionInput.style,
                image_url: quickActionInput.uri,
                width: 512,
                height: 512,
                style: 'photorealistic'
              })
            }
          }
        }
      },

      // Define output generation behavior
      output: {
        // Allow cancellation of generation
        abortable: true,

        // Store generated assets in browser's IndexedDB
        history: '@imgly/indexedDB',

        // Add middleware for logging and uploading
        middleware: [
          loggingMiddleware({ enable: true }),
          // Example of upload middleware that stores generated images on your server
          uploadMiddleware(async (output: ImageOutput) => {
            // In production, upload the image to your server
            // For this example, we just return the output as-is
            console.log('Upload middleware: Processing output', output.url);
            return output;
          }),
          // Custom error handling middleware
          async (input, options, next) => {
            try {
              return await next(input, options);
            } catch (error: any) {
              // Prevent default error notification
              options.preventDefault();

              // Show custom error notification
              options.cesdk?.ui.showNotification({
                type: 'error',
                message: `Image generation failed: ${error.message}`
              });

              throw error;
            }
          }
        ],

        // Configure success/error notifications
        notification: {
          success: {
            show: true,
            message: 'Image generated successfully!'
          },
          error: {
            show: true,
            message: (context) => `Generation failed: ${context.error}`
          }
        },

        // The core generation function
        generate: async (input, { abortSignal }) => {
          try {
            // Use mock API for demonstration
            // In production, replace with actual API call:
            // const response = await fetch(config.proxyUrl, { ... });
            const data = await mockGenerateImage(input, abortSignal);

            // Return the image URL
            return {
              kind: 'image',
              url: data.imageUrl
            };
          } catch (error) {
            console.error('Image generation failed:', error);
            throw error;
          }
        }
      }
    };

    return provider;
  };
}

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
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    // Add translations for the custom provider
    cesdk.i18n.setTranslations({
      en: {
        'panel.my-image-provider.generate': 'Generate Image'
      }
    });

    // Add your image generation provider
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: MyImageProvider({
            proxyUrl: 'https://your-proxy-server.com/api/proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          })
        },
        debug: true
      })
    );

    // Add the dock component to open the AI image generation panel
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai.image-generation.dock',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Open the AI Image Generation panel
    cesdk.ui.openPanel('ly.img.ai.image-generation');
  }
}

// Example: Control which features are visible in the UI
function configureFeatures(cesdk: CreativeEditorSDK) {
  // Hide the provider dropdown if you only have one provider
  cesdk.feature.enable(
    'ly.img.plugin-ai-image-generation-web.providerSelect',
    false
  );
  // Enable text-to-image generation
  cesdk.feature.enable('ly.img.plugin-ai-image-generation-web.fromText', true);
  // Disable image-to-image generation
  cesdk.feature.enable(
    'ly.img.plugin-ai-image-generation-web.fromImage',
    false
  );
}

export default Example;
