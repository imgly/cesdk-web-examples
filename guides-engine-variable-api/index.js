// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.2/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  // highlight-findAll
  const variableNames = engine.variable.findAll();
  // highlight-findAll
  // highlight-setString
  engine.variable.setString('name', 'Chris');
  // highlight-setString
  // highlight-getString
  const name = engine.variable.getString('name');
  // highlight-getString
  // highlight-remove
  engine.variable.remove('name');
  // highlight-remove

  engine.dispose();
});
