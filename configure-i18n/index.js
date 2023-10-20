import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.3/cesdk.umd.js';

// highlight-config
const config = {
  // highlight-locale
  locale: 'fr',
  // highlight-locale
  // highlight-i18n
  i18n: {
    fr: {
      'common.back': 'Retour',
      // highlight-meta
      'meta.currentLanguage': 'Français'
    },
    it: {
      'common.back': 'Indietro',
      'meta.currentLanguage': 'Italiano'
    },
    // highlight-i18n
  }
};
// highlight-config

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
