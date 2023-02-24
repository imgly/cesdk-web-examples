// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.0-preview.2/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.0-preview.2/assets'
};

// Fetch scene file and store it as a string.
const SCENE_CONTENT = await fetch(
  'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.0-preview.2/assets/templates/cesdk_postcard_1.scene'
).then((response) => {
  return response.text();
});

CreativeEngine.init(config).then(async (engine) => {
  // Creating scenes
  // highlight-create
  let scene = engine.scene.create();
  // highlight-create
  // highlight-createFromImage
  scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  // highlight-createFromImage
  // Export the scene to an image
  let imageData = await engine.block.export(scene);
  // highlight-setup

  // Loading scenes
  // highlight-loadFromString
  scene = engine.scene.loadFromString(SCENE_CONTENT);
  // highlight-loadFromURL
  scene = await engine.scene.loadFromURL(
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.0-preview.2/assets/templates/cesdk_postcard_1.scene'
  );
  imageData = await engine.block.export(scene);

  // Save the scene
  // highlight-saveToString
  scene = await engine.scene.saveToString();

  // highlight-saveToArchive
  const archive = await engine.scene.saveToArchive();

  // Apply a template scene
  // highlight-applyTemplateFromString
  engine.scene.applyTemplateFromString(SCENE_CONTENT);
  // highlight-applyTemplateFromURL
  engine.scene.applyTemplateFromURL(
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.0-preview.2/assets/templates/cesdk_postcard_1.scene'
  );

  // Get the scene id
  // highlight-get
  scene = engine.scene.get();
  // highlight-get

  // highlight-zoom
  engine.scene.setZoomLevel(1.0);
  engine.scene.setZoomLevel(0.5 * engine.scene.getZoomLevel());
  await engine.scene.zoomToBlock(scene, 20.0, 20.0, 20.0, 20.0);
  // highlight-zoom

  engine.dispose();
});
