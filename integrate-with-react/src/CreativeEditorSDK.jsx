import './index.css';

import CreativeEditor from '@cesdk/cesdk-js/react';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user'
};

const init = async (cesdk) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true })
  ]);
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}
