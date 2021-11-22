import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.2.0/cesdk.umd.js';

// highlight-config
const config = {
  // highlight-locale
  locale: 'en',
  // highlight-locale
  // highlight-i18n
  i18n: {
    en: {
      block: {
        page: {
          title: "Artboard {{number}}"
        }
      }
    }
    // highlight-i18n
  }
};
// highlight-config

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
