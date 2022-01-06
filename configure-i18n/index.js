import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.3.0/cesdk.umd.js';

// highlight-config
const config = {
  // highlight-locale
  locale: 'fr',
  // highlight-locale
  // highlight-i18n
  i18n: {
    fr: {
      common: {
        back: "Retour"
      }
    }
    // highlight-i18n
  }
};
// highlight-config

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
