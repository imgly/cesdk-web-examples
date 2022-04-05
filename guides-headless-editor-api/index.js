// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.2/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  // Creating scenes
  // highlight-create
  let scene = engine.scene.create();
  // highlight-create
  // highlight-createFromImage
  scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  // highlight-createFromImage

  // highlight-zoom
  engine.editor.setZoomLevel(2.0 * engine.editor.getZoomLevel());
  // highlight-zoom

  // highlight-addUndoStep
  engine.editor.addUndoStep();

  // highlight-undo
  if (engine.editor.canUndo()) {
    engine.editor.undo();
  }
  // highlight-undo

  // highlight-redo
  if (engine.editor.canRedo()) {
    engine.editor.redo();
  }
  // highlight-redo

  // highlight-setSettingString
  engine.editor.setSettingString('ubq://license', 'invalid');
  // highlight-setSettingFloat
  engine.editor.setSettingFloat('ubq://positionSnappingThreshold', 2.0);
  // highlight-setSettingBool
  engine.editor.setSettingBool('ubq://doubleClickToCropEnabled', true);

  // Export the scene to an image
  await engine.block.export(scene);

  engine.dispose();
});
