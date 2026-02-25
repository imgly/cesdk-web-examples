'use client';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { VideoEditorConfig } from './lib/video-editor/plugin';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

let RENDERER_PROXY_URL = '';

/**
 * Fully exports a scene by sending an archived version of it to a CE.SDK Renderer API server,
 * listens for partial progress updates and downloads the scene when done.
 *
 * @param {Blob} archiveBlob The archived scene data to send to the server for export
 * @param {CreativeEditorSDK} cesdk The CE.SDK instance to use for progress updates
 * @param {string} notificationId The notification ID to use for progress updates
 */
async function exportUsingRenderer(archiveBlob, cesdk, notificationId) {
  cesdk.ui.updateNotification(notificationId, {
    message: 'Uploading the archive...',
    duration: 'infinite',
    type: 'loading'
  });
  let uploadFinished = 0,
    renderFinished = 0;
  // Use an XMLHttpRequest for its flexible progress notifications
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (event) => {
    if (!event.lengthComputable) {
      return;
    }
    const progress = Math.round(100.0 * (event.loaded / event.total));
    if (progress >= 100 && !uploadFinished) {
      uploadFinished = Date.now();
    }
    cesdk.ui.updateNotification(notificationId, {
      message:
        progress >= 100
          ? 'Rendering on the server...'
          : `Uploading the archive... (${progress}% complete)`,
      duration: 'infinite',
      type: 'loading'
    });
  });
  xhr.addEventListener('progress', (event) => {
    if (!event.lengthComputable) {
      return;
    }
    if (!renderFinished) {
      renderFinished = Date.now();
    }
    const progress = Math.round(100.0 * (event.loaded / event.total));
    cesdk.ui.updateNotification(notificationId, {
      message: `Downloading the exported video... (${progress}% complete)`,
      duration: 'infinite',
      type: 'loading'
    });
  });
  await new Promise((resolve, reject) => {
    xhr.addEventListener('error', (err) => {
      reject(err);
    });
    xhr.addEventListener('loadend', () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve();
      } else {
        reject(xhr.statusText);
      }
    });
    xhr.open('POST', RENDERER_PROXY_URL, true);
    xhr.responseType = 'blob';
    const payload = new FormData();
    payload.set('scene', archiveBlob);
    xhr.send(payload);
  });
  cesdk.ui.updateNotification(notificationId, {
    message: `Video downloaded, server render took ${Math.round((renderFinished - uploadFinished) / 100.0) / 10.0} seconds`,
    duration: 'infinite',
    type: 'success'
  });
  const mimeType = xhr.getResponseHeader('content-type');
  cesdk.utils.downloadFile(xhr.response, mimeType);
}

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    // Add the video editor configuration plugin first
    await instance.addPlugin(new VideoEditorConfig());

    // Asset Source Plugins (replaces addDefaultAssetSources)
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(new CaptionPresetsAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());

    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.video.*',
          'ly.img.audio.*'
        ]
      })
    );

    // Disable placeholder and preview features
    instance.feature.set('ly.img.placeholder', false);
    instance.feature.set('ly.img.preview', false);
    // Add a custom export button
    instance.actions.register('exportDesign', async () => {
      const progressNotification = instance.ui.showNotification({
        message: 'Archiving...',
        duration: 'infinite',
        type: 'loading'
      });
      const archive = await instance.engine.scene.saveToArchive();
      try {
        await exportUsingRenderer(archive, instance, progressNotification);
      } catch (error) {
        console.error('Error encountered during scene export: ', error);
        instance.ui.dismissNotification(progressNotification);
        instance.ui.showNotification({
          message: 'Export failed',
          type: 'error'
        });
      }
    });
    instance.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-using-renderer',
            label: 'Export using CE.SDK Renderer',
            icon: '@imgly/Video',
            onClick: () => instance.actions.run('exportDesign')
          },
          'ly.img.importArchive.navigationBar',
          'ly.img.importScene.navigationBar'
        ]
      }
    ]);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/export-using-renderer/example-video-motion.scene`
    );
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default CaseComponent;
