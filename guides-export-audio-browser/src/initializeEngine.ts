import CreativeEditorSDK from '@cesdk/cesdk-js';
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
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from '../video-editor/plugin';

export async function initializeCESDK(container) {
  const cesdk = await CreativeEditorSDK.create(container, {
    // license: import.meta.env.VITE_CESDK_LICENSE,
    userId: 'guides-user',
    // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
    // Use local assets when developing with local packages
    ...(import.meta.env.CESDK_USE_LOCAL && {
      baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
    }),
    // Configure UI for timeline and audio features
    ui: {
      elements: {
        panels: {
          settings: true
        }
      }
    },
    // Configure for video/audio processing
    featureFlags: {
      exportWorker: true,  // Enable background audio export
      dangerouslyDisableVideoSupportCheck: false
    }
  });

  await cesdk.addPlugin(new VideoEditorConfig());

  // Load asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );

  // Initialize with video scene for audio capabilities
  await cesdk.actions.run('scene.create', { layout: 'DepthStack', page: { width: 1920, height: 1080, unit: 'Pixel' } });

  console.log('CE.SDK initialized successfully with audio features');
  return cesdk;
}

export async function setupAudioScene(cesdk) {
  // Get the current scene
  const scene = cesdk.engine.scene.get();

  // Set up a video scene with timeline
  const page = cesdk.engine.scene.getCurrentPage();

  // Set page to 16:9 format (1920x1080)
  const width = cesdk.engine.block.getWidth(page);
  const height = cesdk.engine.block.getHeight(page);

  // Set page duration for timeline
  cesdk.engine.block.setDuration(page, 30); // 30 seconds

  // Enable timeline view for audio tracks
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    {
      id: 'ly.img.timeline',
      label: 'Timeline',
      icon: '@imgly/Timeline',
      entries: []
    },
    ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
  ]);

  return { scene, page };
}