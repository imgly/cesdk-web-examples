import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

async function initialize() {
  const cesdk = await CreativeEditorSDK.create('#cesdk_container', {
    userId: 'guides-user'
  });
  (window as any).cesdk = cesdk;
  await cesdk.addPlugin(new Example());
  await cesdk.engine.scene.zoomToBlock(
    cesdk.engine.block.findByType('page')[0],
    {
      padding: { left: 40, top: 100, right: 40, bottom: 100 }
    }
  );
}

void initialize().catch(console.error);
