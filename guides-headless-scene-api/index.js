// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/assets'
};

// Fetch scene file and store it as a string.
const SCENE_CONTENT = await fetch(
  'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/assets/templates/cesdk_postcard_1.scene'
).then((response) => {
  return response.text();
});

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  // Creating scenes
  //  highlight-create
  let scene = engine.scene.create();
  //  highlight-create
  //  highlight-createFromImage
  scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  // highlight-createFromImage
  // Export the scene to an image
  let imageData = await engine.block.export(scene);

  // Loading scenes
  // highlight-loadFromString
  scene = engine.scene.loadFromString(SCENE_CONTENT);
  //  highlight-loadFromURL
  scene = await engine.scene.loadFromURL(
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/assets/templates/cesdk_postcard_1.scene'
  );
  imageData = await engine.block.export(scene);

  // Save the scene
  // highlight-saveToString
  scene = await engine.scene.saveToString();

  // Get the scene id
  // highlight-get
  scene = engine.scene.get();
  // highlight-get

  engine.dispose();
});
