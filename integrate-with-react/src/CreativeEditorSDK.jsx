import './index.css';

import CreativeEditor from '@cesdk/cesdk-js/react';

// import {
//   DesignEditorConfig,
//   // VideoEditorConfig,
//   // PhotoEditorConfig
// } from '@cesdk/cesdk-js/configs';

// import {
//   FiltersAssetSource,
//   EffectsAssetSource,
//   ColorPaletteAssetSource
// } from '@cesdk/cesdk-js/plugins';

const config = {
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // When using local packages, load assets from the dev server
  ...(import.meta.env.CESDK_USE_LOCAL && { baseURL: '/assets/' })
};

const init = async (cesdk) => {
  // TODO: Uncomment when configs/plugins are released
  // Configure the editor
  // await cesdk.addPlugin(new DesignEditorConfig());
  // await cesdk.addPlugin(new VideoEditorConfig());
  // await cesdk.addPlugin(new PhotoEditorConfig());

  // Configure the asset sources
  // await cesdk.addPlugin(new FiltersAssetSource());
  // await cesdk.addPlugin(new EffectsAssetSource());
  // await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Create the scene
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
