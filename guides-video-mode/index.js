import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.0/index.js';

window.onload = async () => {
  const config = {
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
    userId: 'guides-user',
    theme: 'light',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.0/assets',
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
        },
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

  const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
  cesdk.addDefaultAssetSources();
  cesdk.addDemoAssetSources({ sceneMode: 'Video' });
  cesdk.ui.setBackgroundTrackAssetLibraryEntries(['ly.img.image', 'ly.img.video']);
  const scene = await cesdk.createVideoScene();
};

