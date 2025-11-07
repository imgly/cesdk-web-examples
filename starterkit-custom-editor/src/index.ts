import CreativeEditorSDK from '@cesdk/cesdk-js';

import { CustomEditorConfig } from './imgly/plugin';

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
  userId: 'starterkit-custom-editor-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Add the custom editor plugin
    await cesdk.addPlugin(new CustomEditorConfig());

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
    // await cesdk.createDesignScene();
    await cesdk.engine.scene.loadFromArchiveURL(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
