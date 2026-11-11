import CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  ColorPaletteAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from '../../video-editor/plugin';


/** Creates the video editor and releases it when the page lifetime ends. */
export async function initEditor(signal: AbortSignal) {
  const cesdk = await CreativeEditorSDK.create('#cesdk-container', {
    // license: 'YOUR_CESDK_LICENSE_KEY',
    userId: 'lottie-import-showcase'
  });
  if (signal.aborted) {
    cesdk.dispose();
    return;
  }
  signal.addEventListener('abort', () => cesdk.dispose(), { once: true });
  await cesdk.addPlugin(new VideoEditorConfig());
  for (const plugin of [
    new ColorPaletteAssetSource(),
    new TypefaceAssetSource(),
    new TextAssetSource(),
    new VectorShapeAssetSource()
  ]) {
    if (signal.aborted) {
      return;
    }
    await cesdk.addPlugin(plugin);
  }
  if (signal.aborted) {
    return;
  }
  await cesdk.actions.run('scene.create', {
    layout: 'DepthStack',
    page: { width: 1280, height: 720, unit: 'Pixel' }
  });
  return cesdk;
}
