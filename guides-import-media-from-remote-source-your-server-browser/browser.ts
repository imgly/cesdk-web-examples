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
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Register a custom asset source for images from your backend API
    engine.asset.addSource({
      id: 'my-server-images',
      async findAssets(queryData) {
        // Replace with your API: fetch(`/api/images?page=${queryData.page}&q=${queryData.query}`)
        const filtered = filterByQuery(MOCK_IMAGES, queryData.query);
        const paginated = paginate(filtered, queryData.page, queryData.perPage);

        return {
          assets: paginated.items.map((item) => ({
            id: item.id,
            label: item.title,
            meta: {
              uri: item.url,
              thumbUri: item.thumbnail,
              blockType: '//ly.img.ubq/graphic',
              fillType: '//ly.img.ubq/fill/image',
              width: item.width,
              height: item.height
            }
          })),
          total: filtered.length,
          currentPage: queryData.page,
          nextPage: paginated.nextPage
        };
      }
    });

    // Register a custom source for video assets
    engine.asset.addSource({
      id: 'my-server-videos',
      async findAssets(queryData) {
        const filtered = filterByQuery(MOCK_VIDEOS, queryData.query);

        return {
          assets: filtered.map((item) => ({
            id: item.id,
            label: item.title,
            meta: {
              uri: item.url,
              thumbUri: item.thumbnail,
              blockType: '//ly.img.ubq/graphic',
              fillType: '//ly.img.ubq/fill/video',
              duration: String(item.duration)
            }
          })),
          total: filtered.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      }
    });

    // Register a custom source for audio assets
    engine.asset.addSource({
      id: 'my-server-audio',
      async findAssets(queryData) {
        const filtered = filterByQuery(MOCK_AUDIO, queryData.query);

        return {
          assets: filtered.map((item) => ({
            id: item.id,
            label: item.title,
            meta: {
              uri: item.url,
              thumbUri: item.thumbnail,
              blockType: '//ly.img.ubq/audio',
              mimeType: item.mimeType,
              duration: String(item.duration)
            }
          })),
          total: filtered.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      }
    });

    // Register a custom source for sticker assets (PNG/SVG overlays)
    engine.asset.addSource({
      id: 'my-server-stickers',
      async findAssets(queryData) {
        const filtered = filterByQuery(MOCK_STICKERS, queryData.query);

        return {
          assets: filtered.map((item) => ({
            id: item.id,
            label: item.title,
            meta: {
              uri: item.url,
              thumbUri: item.thumbnail,
              blockType: '//ly.img.ubq/graphic',
              fillType: '//ly.img.ubq/fill/image',
              kind: 'sticker',
              width: item.width,
              height: item.height
            }
          })),
          total: filtered.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      }
    });

    // Register a custom source for scene templates
    engine.asset.addLocalSource(
      'my-server-templates',
      undefined,
      async (asset) => {
        if (asset.meta?.uri) {
          await engine.scene.loadFromURL(asset.meta.uri as string);
        }
        return undefined;
      }
    );

    // Add video templates to the source
    for (const template of MOCK_TEMPLATES) {
      engine.asset.addAssetToSource('my-server-templates', {
        id: template.id,
        label: { en: template.title },
        meta: { uri: template.url, thumbUri: template.thumbnail }
      });
    }

    // Load static assets from a JSON manifest file
    await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/v1/ly.img.sticker/content.json'
    );

    // Add a custom entry to the asset library panel
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-server-assets',
      sourceIds: [
        'my-server-images',
        'my-server-videos',
        'my-server-audio',
        'my-server-stickers',
        'my-server-templates'
      ],
      title: ({ sourceId }) => SOURCE_TITLES[sourceId ?? ''] ?? 'My Server',
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Add a dock button for "My Server" as the first item with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'my-server-assets.dock',
      'ly.img.separator',
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    cesdk.ui.registerComponent(
      'my-server-assets.dock',
      ({ builder: { Button } }) => {
        Button('my-server-dock-button', {
          label: 'My Server',
          onClick: () => {
            cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
              payload: { entries: ['my-server-assets'] }
            });
          }
        });
      }
    );

    // Open the asset library to show our custom server assets
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-server-assets'] }
    });

    // Apply sample assets to canvas for verification
    await applyFirstAsset(engine, 'my-server-images');
    await applyFirstAsset(engine, 'my-server-videos');
    await applyFirstAsset(engine, 'my-server-audio');
    await applyFirstAsset(engine, 'my-server-stickers');
  }
}

export default Example;

// ============================================================================
// Mock Data - Replace with your backend API
// ============================================================================

interface MockAsset {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  width?: number;
  height?: number;
  duration?: number;
  mimeType?: string;
}

const MOCK_IMAGES: MockAsset[] = [
  {
    id: 'img-001',
    title: 'Mountain Landscape',
    url: 'https://img.ly/static/ubq_samples/sample_1.jpg',
    thumbnail: 'https://img.ly/static/ubq_samples/sample_1.jpg',
    width: 1920,
    height: 1280
  },
  {
    id: 'img-002',
    title: 'Ocean Sunset',
    url: 'https://img.ly/static/ubq_samples/sample_2.jpg',
    thumbnail: 'https://img.ly/static/ubq_samples/sample_2.jpg',
    width: 1920,
    height: 1280
  },
  {
    id: 'img-003',
    title: 'Forest Path',
    url: 'https://img.ly/static/ubq_samples/sample_3.jpg',
    thumbnail: 'https://img.ly/static/ubq_samples/sample_3.jpg',
    width: 1920,
    height: 1280
  },
  {
    id: 'img-004',
    title: 'City Skyline',
    url: 'https://img.ly/static/ubq_samples/sample_4.jpg',
    thumbnail: 'https://img.ly/static/ubq_samples/sample_4.jpg',
    width: 1920,
    height: 1280
  },
  {
    id: 'img-005',
    title: 'Desert Dunes',
    url: 'https://img.ly/static/ubq_samples/sample_5.jpg',
    thumbnail: 'https://img.ly/static/ubq_samples/sample_5.jpg',
    width: 1920,
    height: 1280
  }
];

const MOCK_VIDEOS: MockAsset[] = [
  {
    id: 'vid-001',
    title: 'Surfer Barrelling a Wave',
    url: 'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
    thumbnail:
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/thumbnails/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.jpg',
    duration: 15.58
  }
];

const MOCK_AUDIO: MockAsset[] = [
  {
    id: 'audio-001',
    title: 'Background Music',
    url: 'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a',
    thumbnail:
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/thumbnails/dance_harder.jpg',
    duration: 212.5,
    mimeType: 'audio/x-m4a'
  }
];

const MOCK_STICKERS: MockAsset[] = [
  {
    id: 'sticker-001',
    title: 'Camera',
    url: 'https://cdn.img.ly/assets/v1/ly.img.sticker/images/doodle/doodle_camera.svg',
    thumbnail:
      'https://cdn.img.ly/assets/v1/ly.img.sticker/thumbnails/doodle/doodle_camera.png',
    width: 2048,
    height: 1339
  }
];

const MOCK_TEMPLATES: MockAsset[] = [
  {
    id: 'template-001',
    title: 'Surf School Promo',
    url: 'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/milli-surf-school.scene',
    thumbnail:
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/thumbnails/milli-surf-school.png'
  },
  {
    id: 'template-002',
    title: 'Monthly Review',
    url: 'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/monthly-review.scene',
    thumbnail:
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/thumbnails/monthly-review.png'
  },
  {
    id: 'template-003',
    title: 'My Plants Video',
    url: 'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/my-plants.scene',
    thumbnail:
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/thumbnails/my-plants.png'
  }
];

const SOURCE_TITLES: Record<string, string> = {
  'my-server-images': 'My User Photos',
  'my-server-videos': 'My User Videos',
  'my-server-audio': 'My User Audio',
  'my-server-stickers': 'My User Stickers',
  'my-server-templates': 'My User Templates'
};

// ============================================================================
// Helper Functions
// ============================================================================

function filterByQuery<T extends { title: string }>(
  items: T[],
  query: string | undefined
): T[] {
  if (!query) return items;
  const searchTerm = query.toLowerCase();
  return items.filter((item) => item.title.toLowerCase().includes(searchTerm));
}

function paginate<T>(
  items: T[],
  page: number,
  perPage: number
): { items: T[]; nextPage: number | undefined } {
  const start = page * perPage;
  const end = start + perPage;
  return {
    items: items.slice(start, end),
    nextPage: end < items.length ? page + 1 : undefined
  };
}

async function applyFirstAsset(
  engine: Parameters<EditorPlugin['initialize']>[0]['cesdk'] extends infer C
    ? C extends { engine: infer E }
      ? E
      : never
    : never,
  sourceId: string
): Promise<void> {
  const results = await engine.asset.findAssets(sourceId, {
    page: 0,
    perPage: 1
  });
  if (results.assets.length > 0) {
    await engine.asset.apply(sourceId, results.assets[0]);
  }
}
