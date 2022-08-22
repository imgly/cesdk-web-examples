import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.8.0-alpha.1/cesdk.umd.js';

// highlight-blob
const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then((response) => response.blob());
// highlight-blob
// highlight-objectURL
const objectURL = URL.createObjectURL(blob);
// highlight-objectURL

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.8.0-alpha.1/assets',
  // highlight-initialImageURL
  initialImageURL: objectURL
  // highlight-initialImageURL
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
