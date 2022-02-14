import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.6/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.6/assets',
  extensions: {
    // highlight-extensions
    baseURL: 'extensions/',
    entries: [
      /// These are our default assets, you can add/remove them by commenting the following lines in or out
      // "ly.img.cesdk.filters.duotone",
      // "ly.img.cesdk.filters.lut",
      // "ly.img.cesdk.stickers.emoticons",
      // "ly.img.cesdk.vectorpaths",
      // "ly.img.cesdk.fonts"
      // "ly.img.cesdk.images.samples",
      // "ly.img.cesdk.effects",
      // "ly.img.cesdk.stickers.doodle",
      // "ly.img.cesdk.stickers.hand",
      // "ly.img.cesdk.stickers.emoji"
    ]
    // highlight-extensions
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
