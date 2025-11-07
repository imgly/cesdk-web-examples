'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';
// import {
//   DesignEditorConfig,
//   //   VideoEditorConfig,
//   //   PhotoEditorConfig
// } from '@cesdk/cesdk-js/configs';

// import {
//   FiltersAssetSource,
//   EffectsAssetSource,
//   ColorPaletteAssetSource
// } from '@cesdk/cesdk-js/plugins';

// Configure CreativeEditor SDK
const config = {
  license: 'YOUR_CESDK_LICENSE_KEY',
  userId: 'guides-user'
};

// Initialization function called after SDK instance is created
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
    // The CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
