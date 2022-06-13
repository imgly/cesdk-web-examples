// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-alpha.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-alpha.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = engine.scene.create();
  scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );
  // highlight-setup

  // highlight-onStateChanged
  const unsubscribe = engine.editor.onStateChanged(() => console.log('Editor state has changed'));

  // highlight-editMode
  engine.editor.setEditMode('Crop');
  engine.editor.getEditMode();
  // highlight-editMode

  // highlight-cursor
  engine.editor.getCursorType();
  engine.editor.getCursorRotation();
  // highlight-cursor

  // highlight-textCursor
  engine.editor.getTextCursorPositionInScreenSpaceX();
  engine.editor.getTextCursorPositionInScreenSpaceY();
  // highlight-textCursor

  // highlight-zoom
  engine.editor.setZoomLevel(2.0 * engine.editor.getZoomLevel());

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

  // highlight-setSettingBool
  engine.editor.setSettingBool('ubq://doubleClickToCropEnabled', true);
  // highlight-getSettingBool
  engine.editor.getSettingBool('ubq://doubleClickToCropEnabled');
  // highlight-setSettingFloat
  engine.editor.setSettingFloat('ubq://positionSnappingThreshold', 2.0);
  // highlight-getSettingFloat
  engine.editor.getSettingFloat('ubq://positionSnappingThreshold');
  // highlight-setSettingString
  engine.editor.setSettingString('ubq://license', 'invalid');
  // highlight-getSettingString
  engine.editor.getSettingString('ubq://license');
  // highlight-setSettingColorRGBA
  engine.block.setSettingColorRGBA('ubq://highlightColor', 1, 0, 1, 1); // Pink
  // highlight-getSettingColorRGBA
  engine.block.getSettingColorRGBA('ubq://highlightColor');
  // highlight-setSettingEnum
  engine.block.setSettingEnum('ubq://role', 'Presenter');
  // highlight-getSettingEnum
  engine.block.getSettingEnum('ubq://role');

  // Export the scene to an image
  await engine.block.export(scene);

  engine.dispose();
});
