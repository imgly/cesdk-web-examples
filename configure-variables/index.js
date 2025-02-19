
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/assets',
  // highlight-variables
  variables: {
    my_custom_variable: {
      // highlight-value
      value: 'IMG.LY'
      // highlight-value
    }
  },
  // highlight-variables
  // highlight-localization
  i18n: {
    en: {
      'variables.my_custom_variable.label': 'My Variable'
    }
  }
  // highlight-localization
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
