import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.0/cesdk.umd.js';

// highlight-config
let config = {
  license: 'eyJhbGciOiJSUzI1NiIsInR5…' // Replace with private license 
};
// highlight-config

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  await instance.createDesignScene();
});
