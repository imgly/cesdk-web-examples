
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.0.0-rc.5/cesdk.umd.js';

// highlight-config
let config = {
  // highlight-baseurl
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.0.0-rc.5/assets',
  // highlight-baseurl
  // highlight-locale
  locale: 'en', // 'de'
  // highlight-locale
  // highlight-theme
  theme: 'dark', // 'light'
  // highlight-theme
  // highlight-role
  role: 'Creator', // 'Adopter' 'Viewer'
  // highlight-role
  // highlight-initialScene
  initialScene: '' // A scene string
  // highlight-initialScene
};
// highlight-config

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
