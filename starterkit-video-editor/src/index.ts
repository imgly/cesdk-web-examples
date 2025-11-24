import CreativeEditorSDK from '@cesdk/cesdk-js';

// Option 1: Use turnkey configuration from NPM (production-ready)
// import { VideoEditorConfig } from '@cesdk/cesdk-js/configs/starterkits-video-editor';
// Option 2: Import from local starter kit (for customization)
import { VideoEditorConfig } from './imgly/plugin';

// import {
//   BlurAssetSource,
//   CaptionPresetsAssetSource,
//   ColorPaletteAssetSource,
//   CropPresetsAssetSource,
//   DemoAssetSources,
//   EffectsAssetSource,
//   FiltersAssetSource,
//   PagePresetsAssetSource,
//   StickerAssetSource,
//   TextComponentAssetSource,
//   TypefaceAssetSource,
//   VectorPathAssetSource
// } from '@cesdk/cesdk-js/plugins';

const config = {
  userId: 'starterkit-video-editor-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Add the video editor plugin
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    // await cesdk.addPlugin(new BlurAssetSource());
    // await cesdk.addPlugin(new CaptionPresetsAssetSource());
    // await cesdk.addPlugin(new ColorPaletteAssetSource());
    // await cesdk.addPlugin(new CropPresetsAssetSource());
    // await cesdk.addPlugin(new DemoAssetSources());
    // await cesdk.addPlugin(new EffectsAssetSource());
    // await cesdk.addPlugin(new FiltersAssetSource());
    // await cesdk.addPlugin(new PagePresetsAssetSource());
    // await cesdk.addPlugin(new StickerAssetSource());
    // await cesdk.addPlugin(new TextComponentAssetSource());
    // await cesdk.addPlugin(new TypefaceAssetSource());
    // await cesdk.addPlugin(new VectorPathAssetSource());

    // Create or load a scene
    // await cesdk.createVideoScene();
    await cesdk.engine.scene.loadFromArchiveURL(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
