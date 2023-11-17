import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1-rc.1/cesdk.umd.js';

window.onload = async () => {
  const container = document.getElementById('cesdk');

  if (!container) return;

  const config = {
    theme: 'light',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1-rc.1/assets',
    ui: {
      elements: {
        view: 'default',
        panels: {
          settings: true
        },
        navigation: {
          position: 'top',
          action: {
            save: true,
            load: true,
            download: true,
            export: true
          }
        }
      }
    },
    callbacks: {
      onUpload: 'local',
      onSave: (scene) => {
        const element = document.createElement('a');
        const base64Data = btoa(unescape(encodeURIComponent(scene)));
        element.setAttribute(
          'href',
          `data:application/octet-stream;base64,${base64Data}`
        );
        element.setAttribute(
          'download',
          `cesdk-${new Date().toISOString()}.scene`
        );

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      },
      onLoad: 'upload',
      onDownload: 'download',
      onExport: 'download'
    }
  };

  const cesdk = await CreativeEditorSDK.create('#cesdk', config);
  cesdk.addDefaultAssetSources();
  // highlight-demo-asset-sources
  cesdk.addDemoAssetSources({ sceneMode: 'Video' });
  // highlight-demo-asset-sources
  // highlight-create-video-scene
  const scene = await cesdk.createVideoScene();
  // highlight-create-video-scene
  // highlight-default-page-duration
  // Change the default page duration to 10 seconds
  cesdk.engine.block.setFloat(scene, 'scene/defaultPageDuration', 10);
  // highlight-default-page-duration
};
