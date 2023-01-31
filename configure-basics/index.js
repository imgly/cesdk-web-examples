import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.0-preview.0/cesdk.umd.js';

// highlight-config
let config = {
  // highlight-baseurl
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.0-preview.0/assets',
  // highlight-baseurl
  // highlight-locale
  locale: 'en', // 'de'
  // highlight-locale
  // highlight-theme
  theme: 'light', // 'dark'
  // highlight-theme
  // highlight-role
  role: 'Creator', // 'Adopter' 'Viewer'
  // highlight-role
  // highlight-initialSceneMode
  initialSceneMode: 'Design' // 'Video'
  // highlight-initialSceneMode
  // highlight-initialSceneString
  initialSceneString: 'UBQ1ewoiZm9ybW…', // A scene string
  // highlight-initialSceneString
  // highlight-initialSceneURL
  initialSceneURL: `${window.location.protocol}//${window.location.host}/example.scene`, // A URL pointing at a scene file
  // highlight-initialSceneURL
  // highlight-initialImageURL
  initialImageURL: undefined, // A URL pointing to an image file
  // highlight-initialImageURL
};
// highlight-config

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
