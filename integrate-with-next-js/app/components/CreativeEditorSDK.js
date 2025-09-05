'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';

// configure CreativeEditor SDK
const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.59.1-rc.0/assets', // replace with a valid CE.SDK license key
  callbacks: { onUpload: 'local' } // enable local file uploads in the Asset Library
};

// initialization function called after SDK instance is created
const init = async (cesdk) => {
  // do something with the instance of CreativeEditor SDK (e.g., populate
  // the asset library with default / demo asset sources)
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({ sceneMode: 'Design' })
  ]);

  // create a new design scene in the editor
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    // the CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
