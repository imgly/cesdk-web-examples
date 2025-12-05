import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './electron';

const config = {
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {
    cesdk.addPlugin(new Example());
  })
  .catch((error: Error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
