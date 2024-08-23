// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.34.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.34.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  const block = engine.block.findByType('graphic')[0];
  // highlight-setup

  // highlight-findAllScopes
  const scopes = engine.editor.findAllScopes();
  // highlight-findAllScopes

  // highlight-setGlobalScope
  /* Let the global scope defer to the block-level. */
  engine.editor.setGlobalScope('layer/move', 'Defer');

  /* Manipulation of layout properties of any block will fail at this point. */
  try {
    engine.block.setPositionX(block, 100); // Not allowed
  } catch (err) {
    console.log(err.message);
  }
  // highlight-setGlobalScope

  // highlight-getGlobalScope
  /* This will return 'Defer'. */
  engine.editor.getGlobalScope('layer/move');
  // highlight-getGlobalScope

  // highlight-setScopeEnabled
  /* Allow the user to control the layout properties of the image block. */
  engine.block.setScopeEnabled(block, 'layer/move', true);

  /* Manipulation of layout properties of any block is now allowed. */
  try {
    engine.block.setPositionX(block, 100); // Allowed
  } catch (err) {
    console.log(err.message);
  }
  // highlight-setScopeEnabled

  // highlight-isScopeEnabled
  /* Verify that the 'layer/move' scope is now enabled for the image block. */
  engine.block.isScopeEnabled(block, 'layer/move');
  // highlight-isScopeEnabled

  // highlight-isAllowedByScope
  /* This will return true as well since the global scope is set to 'Defer'. */
  engine.block.isAllowedByScope(block, 'layer/move');
  // highlight-isAllowedByScope

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
