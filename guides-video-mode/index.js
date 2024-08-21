import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.4/cesdk.umd.js';

window.onload = async () => {

  const container = document.getElementById('cesdk');

  if (!container) return;

  const config = {
    theme: 'light',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.4/assets',
    // highlight-initial-scene-mode
    initialSceneMode: 'Video',
    // highlight-initial-scene-mode
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

  const cesdk = await CreativeEditorSDK.init('#cesdk', config);
  cesdk.addDefaultAssetSources();
  cesdk.addDemoAssetSources();

  window.cyGlobals = {
    cesdk
  };

  // highlight-default-page-duration
  // Change the default page duration to 10 seconds
  const scene = cesdk.engine.scene.get();
  cesdk.engine.block.setFloat(scene, 'scene/defaultPageDuration', 10)
  // highlight-default-page-duration
};

function paginateAssetResult(
  array,
  { page, perPage } = {
    page: 1,
    perPage: 10
  }
) {
  const pageOffset = (page ?? 0) * perPage;
  const assetsInCurrentPage = array.slice(pageOffset, pageOffset + perPage);
  const total = array.length;
  const currentPage = page;

  const totalFetched = page * perPage + assetsInCurrentPage.length;
  const nextPage = totalFetched < total ? currentPage + 1 : undefined;

  return {
    assets: assetsInCurrentPage,

    total,
    currentPage,
    nextPage
  };
}

function applyQuerySearch(assets, querySearch) {
  return querySearch
    ? assets.filter((asset) => {
        return (asset.label || '')
          .toLowerCase()
          .includes(querySearch.toLowerCase());
      })
    : assets;
}
