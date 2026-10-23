import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
  CommonProperties,
  CommonProviderConfiguration,
  ImageOutput,
  PanelInputSchema,
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

// JSON imports widen literal values such as `type: 'object'` to `string`.
// Restore the document type expected by the schema-driven panel.
const openApiDocument = apiSchema as PanelInputSchema<
  'image',
  MyProviderInput
>['document'];

// Define provider configuration interface extending CommonProviderConfiguration
interface MyProviderConfiguration extends CommonProviderConfiguration<
  MyProviderInput,
  ImageOutput
> {
  // Add any provider-specific configuration here
  customApiKey?: string;
}

// Mock API function that simulates image generation
// In production, this would be replaced with actual API calls
async function mockGenerateImage(
  input: { prompt?: string; style?: string },
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
          document: openApiDocument, // Your OpenAPI schema
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

// The image-to-image schema takes a source image instead of a size and style
interface MyImageToImageInput {
  prompt: string;
  image_url?: string;
}

// Read the size of the selected image, so the generated block matches it.
// An asset source can hand out a `buffer://` URI for a resource the engine
// holds in memory, which the browser cannot load, so resolve those first.
async function getImageDimensions(
  url: string,
  cesdk: CreativeEditorSDK
): Promise<{ width: number; height: number }> {
  let objectURL: string | undefined;

  if (url.startsWith('buffer:')) {
    const mimeType = await cesdk.engine.editor.getMimeType(url);
    const length = cesdk.engine.editor.getBufferLength(url);
    const data = cesdk.engine.editor.getBufferData(url, 0, length);
    const bytes = new Uint8Array(data.byteLength);
    bytes.set(data);
    objectURL = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
  }

  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image();
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error(`Could not load image: ${url}`));
        image.src = objectURL ?? url;
      }
    );
  } finally {
    if (objectURL != null) {
      URL.revokeObjectURL(objectURL);
    }
  }
}

// An image-to-image provider starts from an image the user picks
export function MyImageToImageProvider(
  _config: CommonProviderConfiguration<MyImageToImageInput, ImageOutput>
): (context: {
  cesdk: CreativeEditorSDK;
}) => Promise<Provider<'image', MyImageToImageInput, ImageOutput>> {
  const providerId = 'my-image-to-image-provider';

  return async ({ cesdk }) => {
    const provider: Provider<'image', MyImageToImageInput, ImageOutput> = {
      id: providerId,
      kind: 'image',

      input: {
        panel: {
          type: 'schema',
          document: openApiDocument,
          inputReference: '#/components/schemas/ImageToImageInput',
          userFlow: 'placeholder',
          orderExtensionKeyword: 'x-order-properties',

          // Render `prompt` with a row for the source image, and `image_url`
          // from that row. Custom renderers take precedence over the schema.
          renderCustomProperty: CommonProperties.ImageUrl(providerId, {
            cesdk
          }),

          // Derive the block size from the selected image
          getBlockInput: async (input) => {
            // The selector reports no image as an empty string, not undefined.
            const imageUrl = input.image_url;
            if (!imageUrl) {
              throw new Error('Select a source image before generating.');
            }

            const { width, height } = await getImageDimensions(imageUrl, cesdk);
            return { image: { width, height, label: `AI: ${input.prompt}` } };
          }
        }
      },

      output: {
        abortable: true,
        history: '@imgly/indexedDB',
        generate: async (input, { abortSignal }) => {
          const data = await mockGenerateImage(input, abortSignal);
          return { kind: 'image', url: data.imageUrl };
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

    // Add translations for the custom provider
    cesdk.i18n.setTranslations({
      en: {
        'panel.my-image-provider.generate': 'Generate Image'
      }
    });

    // Add your image generation providers
    await cesdk.addPlugin(
      ImageGeneration({
        providers: {
          text2image: MyImageProvider({
            proxyUrl: 'https://your-proxy-server.com/api/proxy',
            headers: {
              'x-client-version': '1.0.0',
              'x-request-source': 'cesdk-tutorial'
            }
          }),
          image2image: MyImageToImageProvider({
            proxyUrl: 'https://your-proxy-server.com/api/proxy'
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reference implementation exported as example snippet in docs.
function configureFeatures(cesdk: CreativeEditorSDK) {
  // Hide the provider dropdown if you only have one provider
  cesdk.feature.set(
    'ly.img.plugin-ai-image-generation-web.providerSelect',
    () => false
  );
  // Enable text-to-image generation
  cesdk.feature.set(
    'ly.img.plugin-ai-image-generation-web.fromText',
    () => true
  );
  // Disable image-to-image generation
  cesdk.feature.set(
    'ly.img.plugin-ai-image-generation-web.fromImage',
    () => false
  );
}

export default Example;
