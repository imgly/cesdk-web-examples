
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.7.0-alpha.3/cesdk.umd.js';

CreativeEditorSDK.init('#cesdk_container').then(async (cesdk) => {
  // highlight-fetch-blob
  const sceneUrl = 'https://cdn.img.ly/packages/imgly/cesdk-js/1.7.0-alpha.3/assets/templates/cesdk_postcard_1.scene';
  const sceneBlob = await fetch(sceneUrl)
    .then((response) => { return response.blob() });
  // highlight-fetch-blob


  // highlight-read-blob
  const sceneFromBlob = await sceneBlob.text();
  // highlight-read-blob
  // highlight-load
  cesdk.load(sceneFromBlob).then(() => {
    console.log('Load succeeded')
  }).catch((error) => {
    console.error('Load failed', error)
  });
  // highlight-load
});
