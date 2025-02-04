import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/assets',
  // highlight-initialImageURL
  initialImageURL: 'https://img.ly/static/ubq_samples/sample_4.jpg'
  // highlight-initialImageURL
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
