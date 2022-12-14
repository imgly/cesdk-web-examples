import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/cesdk.umd.js';

// Draw the text 'img.ly' to the demo canvas
const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
ctx.font = "100px Arial";
ctx.fillText("img.ly", 120, 270);

// highlight-dataURL
const dataURL = canvas.toDataURL();
// highlight-dataURL

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/assets',
  // highlight-initialImageURL
  initialImageURL: dataURL
  // highlight-initialImageURL
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
