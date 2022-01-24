// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/assets'
};

// Fetch scene file and store it as a string.
const SCENE_CONTENT = await fetch('https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/assets/templates/cesdk_postcard_1.scene')
  .then((response) => { return response.text() });

CreativeEngine.init(document.getElementById('cesdk_canvas'), config).then(
  // highlight-setup
  async (engine) => {
    // Loading scenes
    // highlight-loadFromString
    let scene = engine.scene.loadFromString(SCENE_CONTENT);
    //  highlight-loadFromURL
    scene = await engine.scene.loadFromURL('https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/assets/templates/cesdk_postcard_1.scene');

    // Creating scenes
    //  highlight-create
    scene = engine.scene.create();
    //  highlight-create
    //  highlight-createFromImage
    scene = await engine.scene.createFromImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    // highlight-createFromImage

    // Save the scene
    // highlight-saveToString
    scene = await engine.scene.saveToString();

    // Get the scene id
    // highlight-get
    scene = engine.scene.get();
    // highlight-get

    engine.dispose();
  }
);
