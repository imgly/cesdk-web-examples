import type {
  AssetDefinition,
  AssetResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: User Upload Guide
 *
 * This example demonstrates:
 * - Enabling upload functionality with demo asset sources
 * - Creating a custom asset source with upload support
 * - Registering a custom upload handler for production use
 * - Handling upload progress
 * - Using the default local upload utility
 * - Validating files before processing
 */

// Store uploaded assets in memory (in production, use a database or API)
const uploadedAssets: AssetResult[] = [];
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable upload functionality with demo asset sources
    cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a custom asset source with upload support
    const engine = cesdk.engine;
    engine.asset.addSource({
      id: 'my-uploads',

      // Return stored assets when queried
      async findAssets(queryData) {
        return {
          assets: uploadedAssets,
          total: uploadedAssets.length,
          currentPage: queryData.page
        };
      },

      // Enable uploads by specifying accepted MIME types
      getSupportedMimeTypes() {
        return ['image/jpeg', 'image/png', 'image/webp'];
      },

      // Store uploaded assets (convert AssetDefinition to AssetResult)
      addAsset(asset: AssetDefinition) {
        uploadedAssets.push({
          id: asset.id,
          label: asset.label?.en,
          meta: asset.meta,
          groups: asset.groups
        });
      }
    });

    // Register a custom upload handler for production use
    cesdk.actions.register(
      'uploadFile',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (file: File, onProgress, _context) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            `Unsupported file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`
          );
        }

        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error('File exceeds maximum size of 50MB');
        }

        // Simulate upload progress for demonstration
        // In production, use XMLHttpRequest or fetch with progress tracking
        for (let progress = 0; progress <= 0.9; progress += 0.1) {
          onProgress(progress);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Simulate uploading to a CDN (replace with your actual upload logic)
        // In production, you would use fetch or XMLHttpRequest to upload to your server
        const mockCdnUrl = URL.createObjectURL(file);
        const mockThumbUrl = mockCdnUrl;

        // Signal upload complete
        onProgress(1);

        // Return the asset definition with permanent URLs
        return {
          id: `uploaded-asset-${Date.now()}`,
          label: {
            en: file.name
          },
          meta: {
            uri: mockCdnUrl,
            thumbUri: mockThumbUrl,
            kind: 'image'
          }
        };
      }
    );

    // Create a design scene
    await cesdk.createDesignScene();

    // Get the page and set dimensions
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (page) {
      engine.block.setWidth(page, 800);
      engine.block.setHeight(page, 600);
    }

    // Zoom to fit content
    if (page) {
      await engine.scene.zoomToBlock(page, {
        padding: {
          left: 40,
          top: 40,
          right: 40,
          bottom: 40
        }
      });
    }

    // Log a message to guide users
    console.log(
      'Upload example ready! Click the "Images" panel in the asset library and use the upload button to add images.'
    );
  }
}

export default Example;
