
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

CreativeEditorSDK.init('#cesdk_container').then((cesdk) => {
  // highlight-save
  cesdk.save().then((sceneAsString) => {
    console.log('Save succeeded');
    // highlight-result
    console.log(sceneAsString);
    // highlight-result
  }).catch((error) => {
    console.error('Save failed', error);
  });
  // highlight-save
});
