import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.5.0/cesdk.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.5.0/assets',
  // highlight-page
  page: {
    title: {
      // highlight-show
      show: true,
      // highlight-show
      // highlight-font
      // Relative path is resolved relative to `baseURL`.
      fontFileUri: '/extensions/ly.img.cesdk.fonts/fonts/Permanent_Marker/PermanentMarker-Regular.ttf',
      // highlight-font
    },
    // highlight-dimOutOfPageAreas
    dimOutOfPageAreas: true
  }
  // highlight-page
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
