
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.6/cesdk.umd.js';

CreativeEditorSDK.init('#cesdk_container').then(async (cesdk) => {
  // highlight-fetch-string
  const sceneUrl = 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.6/assets/templates/cesdk_postcard_1.scene';
  const scene = await fetch(sceneUrl)
    .then((response) => { return response.text() });
  // highlight-fetch-string

  // highlight-load
  cesdk.loadFromString(scene).then(() => {
    console.log('Load succeeded')
  }).catch((error) => {
    console.error('Load failed', error)
  });
  // highlight-load
});
