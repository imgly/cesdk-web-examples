import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

async function initialize() {
  const cesdk = await CreativeEditorSDK.create('#cesdk_container', {
    userId: 'guides-user'
  });
  (window as any).cesdk = cesdk;
  await cesdk.addPlugin(new Example());
}

void initialize().catch(console.error);
