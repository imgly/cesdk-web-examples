import CreativeEditorSDK from '@cesdk/cesdk-js';

export async function initializeCESDK(container) {
  const cesdk = await CreativeEditorSDK.create(container, {
    // license: import.meta.env.VITE_CESDK_LICENSE,
    userId: 'guides-user',
    // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
    // Use local assets when developing with local packages
    ...(import.meta.env.CESDK_USE_LOCAL && {
      baseURL: '/assets/'
    }),
    // Enable video mode for timeline and audio features
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

  // Enable video features (required for video/audio blocks)
  cesdk.feature.enable('ly.img.video');
  cesdk.feature.enable('ly.img.timeline');
  cesdk.feature.enable('ly.img.playback');

  // Load asset sources
  await cesdk.addDefaultAssetSources();
  await cesdk.addDemoAssetSources({
    sceneMode: 'Video',
    withUploadAssetSources: true
  });

  // Initialize with video scene for audio capabilities
  await cesdk.actions.run('scene.create', { mode: 'Video', page: { width: 1920, height: 1080, unit: 'Pixel' } });

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