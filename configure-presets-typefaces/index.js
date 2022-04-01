import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.5/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.5/assets',
  theme: 'light',
  presets: {
    // highlight-typefaces
    typefaces: {
      orbitron: {
        // highlight-family
        family: 'Orbitron',
        // highlight-family
        // highlight-fonts
        fonts: [
          {
            // highlight-fontURL
            fontURL: '/Orbitron-Regular.ttf',
            // highlight-fontURL
            // highlight-weight
            weight: 'regular',
            // highlight-weight
            // highlight-style
            style: 'normal'
            // highlight-style
          },{
            fontURL: '/Orbitron-Bold.ttf',
            weight: 'bold',
            style: 'normal'
          }
        ]
        // highlight-fonts
      }
    }
    // highlight-typefaces
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
