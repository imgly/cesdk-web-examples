import CreativeEditorSDK from '@cesdk/cesdk-js';

// Option 1: Use turnkey configuration from NPM (production-ready)
// import { ViewerConfig } from '@cesdk/cesdk-js/configs/starterkits-viewer-editor';
// Option 2: Import from local starter kit (for customization)
import { ViewerConfig } from './imgly/plugin';

const config = {
  userId: 'starterkit-viewer-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Add the viewer plugin
    await cesdk.addPlugin(new ViewerConfig());

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
