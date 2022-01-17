// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.1/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.1/assets'
};

CreativeEngine.init(document.getElementById('cesdk_canvas'), config).then(
  // highlight-setup
  async (engine) => {
    // highlight-findAll
    const variableNames = engine.variable.findAll();
    // highlight-findAll
    // highlight-set
    engine.variable.set('name', 'Chris');
    // highlight-set
    // highlight-get
    const name = engine.variable.get('name');
    // highlight-get

    engine.dispose();
  }
);
