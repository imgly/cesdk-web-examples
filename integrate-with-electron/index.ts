import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './electron';

const config = {
  userId: 'guides-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {
    cesdk.addPlugin(new Example());
  })
  .catch((error: Error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
