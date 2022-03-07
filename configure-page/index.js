import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.3/cesdk.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.3/assets',
  // highlight-page
  page: {
    title: {
      // highlight-show
      show: true,
      // highlight-show
      // highlight-font
      font: '//ly.img.cesdk.fonts/permanent_marker_regular',
      // highlight-font
    }
  }
  // highlight-page
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
