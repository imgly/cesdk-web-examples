import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: false
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // ===== Section 1: Basic Thumbnails =====
    // Add a local asset source with basic thumbnails
    engine.asset.addLocalSource('custom-images');

    // Add an image with 512px width thumbnail (recommended size)
    engine.asset.addAssetToSource('custom-images', {
      id: 'sample-1',
      label: { en: 'Landscape Photo' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg', // 512px recommended
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // Additional images for the asset library (not shown in highlight)
    engine.asset.addAssetToSource('custom-images', {
      id: 'sample-2',
      label: { en: 'Portrait Photo' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('custom-images', {
      id: 'sample-3',
      label: { en: 'Nature Scene' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 2: Preview URIs for Audio =====
    // Add audio assets with preview URIs for playback in the asset library
    engine.asset.addLocalSource('custom-audio');

    // Audio with full URIs and preview clips
    engine.asset.addAssetToSource('custom-audio', {
      id: 'dance-harder',
      label: { en: 'Dance Harder' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a', // Full audio file
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/thumbnails/dance_harder.jpg', // Waveform visualization (image, UI-only)
        previewUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a', // Preview clip - set as block property on canvas
        mimeType: 'audio/x-m4a', // Required for audio preview to work
        blockType: '//ly.img.ubq/audio',
        duration: '212.531995'
      }
    });

    engine.asset.addAssetToSource('custom-audio', {
      id: 'far-from-home',
      label: { en: 'Far From Home' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/thumbnails/audio-wave.png',
        previewUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a',
        mimeType: 'audio/x-m4a',
        blockType: '//ly.img.ubq/audio',
        duration: '98.716009'
      }
    });

    engine.asset.addAssetToSource('custom-audio', {
      id: 'elsewhere',
      label: { en: 'Elsewhere' },
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/elsewhere.m4a',
        thumbUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/thumbnails/elsewhere.jpg',
        previewUri:
          'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/elsewhere.m4a',
        mimeType: 'audio/x-m4a',
        blockType: '//ly.img.ubq/audio',
        duration: '121.2'
      }
    });

    // ===== Section 3: Custom Asset Source with Thumbnail Mapping =====
    // Create a custom asset source that maps external API responses to CE.SDK format
    // This example mimics how Unsplash thumbnails would be mapped
    engine.asset.addSource({
      id: 'custom-api-source',
      async findAssets(queryData) {
        // Simulate external API response (e.g., from Unsplash)
        const mockApiResponse = {
          results: [
            {
              id: 'photo-1',
              urls: {
                full: 'https://img.ly/static/ubq_samples/sample_4.jpg', // High-res
                small: 'https://img.ly/static/ubq_samples/sample_4.jpg' // 512px thumbnail
              },
              alt_description: 'Mountain landscape'
            },
            {
              id: 'photo-2',
              urls: {
                full: 'https://img.ly/static/ubq_samples/sample_5.jpg',
                small: 'https://img.ly/static/ubq_samples/sample_5.jpg'
              },
              alt_description: 'Ocean waves'
            },
            {
              id: 'photo-3',
              urls: {
                full: 'https://img.ly/static/ubq_samples/sample_6.jpg',
                small: 'https://img.ly/static/ubq_samples/sample_6.jpg'
              },
              alt_description: 'Forest path'
            }
          ],
          total: 3
        };

        // Map external API format to CE.SDK AssetResult format
        return {
          assets: mockApiResponse.results.map((photo) => ({
            id: photo.id,
            label: photo.alt_description,
            meta: {
              uri: photo.urls.full, // High-res image for canvas
              thumbUri: photo.urls.small, // Thumbnail for asset library (512px recommended)
              blockType: '//ly.img.ubq/graphic'
            }
          })),
          total: mockApiResponse.total,
          currentPage: queryData.page,
          nextPage:
            mockApiResponse.total > (queryData.page + 1) * queryData.perPage
              ? queryData.page + 1
              : undefined
        };
      }
    });

    // ===== Section 4: Display Customization - Background Types =====
    // Configure how thumbnails scale in the asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ['custom-images', 'custom-api-source'],
      gridBackgroundType: 'cover', // Crop to fill card
      previewBackgroundType: 'contain' // Fit entire image in preview
    });

    // Audio thumbnails with contain to show full waveform
    // Note: Audio assets automatically show a play button overlay for previewing
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      sourceIds: ['custom-audio'],
      gridBackgroundType: 'contain', // Show full waveform
      previewBackgroundType: 'contain',
      cardBorder: true // Add border to make cards more visible
    });

    // ===== Section 5: Display Customization - Grid Layout =====
    // Configure grid columns and item height
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      gridColumns: 3, // 3 columns in grid view
      gridItemHeight: 'square' // Square aspect ratio for all cards
    });

    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      gridColumns: 2, // 2 columns for audio
      gridItemHeight: 'auto' // Auto height based on content
    });

    // ===== Section 6: Display Customization - Card Background Preferences =====
    // Configure fallback order for card backgrounds
    // Try vector path first, then thumbnail image
    cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
      cardBackgroundPreferences: [
        { path: 'meta.vectorPath', type: 'svgVectorPath' }, // Try SVG first
        { path: 'meta.thumbUri', type: 'image' } // Fallback to thumbnail
      ]
    });

    // For images, prioritize thumbnail
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      cardBackgroundPreferences: [
        { path: 'meta.thumbUri', type: 'image' } // Use thumbnail as primary background
      ]
    });

    // Open the asset library to the audio and image panels to demonstrate thumbnails
    // Audio assets are previewable - hover over them to see a play button
    // Click the play button to hear the previewUri audio clip
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.audio', 'ly.img.image']
      }
    });
  }
}

export default Example;
