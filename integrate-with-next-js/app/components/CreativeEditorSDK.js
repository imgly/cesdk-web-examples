'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';

// Configure CreativeEditor SDK
const config = {
  // license: process.env.NEXT_PUBLIC_LICENSE
};

// Initialization function called after SDK instance is created
const init = async (cesdk) => {
  // Do something with the instance of CreativeEditor SDK (e.g., populate
  // the asset library with default / demo asset sources)
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    })
  ]);

  // Create a new design scene in the editor
  await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });
};

export default function CreativeEditorSDKComponent() {
  return (
    // The CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
