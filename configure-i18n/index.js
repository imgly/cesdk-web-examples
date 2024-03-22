import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.23.0-rc.2/index.js';

// highlight-config
const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
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
    }
    // highlight-i18n
  },
  ui: {
    elements: {
      navigation: {
        action: {
          back: true // Enable 'Back' button to show translation label.
        }
      },
      panels: {
        settings: true // Enable Settings panel for switching languages.
      }
    }
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};
// highlight-config

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
