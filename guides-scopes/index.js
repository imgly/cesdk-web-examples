// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0-alpha.1/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0-alpha.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage('https://img.ly/static/ubq_samples/imgly_logo.jpg');
  const image = engine.block.findByType('image')[0];
  // highlight-setup

  // highlight-setGlobalScope
  /* Let the global scope defer to the block-level. */
  engine.editor.setGlobalScope('design/arrange', 'Defer');

  /* Manipulation of layout properties of any block will fail at this point. */
  engine.block.setPositionX(image, 100);
  // highlight-setGlobalScope

  // highlight-getGlobalScope
  /* This will return 'Defer'. */
  engine.editor.getGlobalScope('design/arrange');
  // highlight-getGlobalScope

  // highlight-setScopeEnabled
  /* Allow the user to control the layout properties of the image block. */
  engine.block.setScopeEnabled(image, 'design/arrange', true);
  // highlight-setScopeEnabled

  // highlight-isScopeEnabled
  /* Verify that the 'design/arrange' scope is now enabled for the image block. */
  engine.block.isScopeEnabled(image, 'design/arrange');
  // highlight-isScopeEnabled

  // highlight-isAllowedByScope
  /* This will return true as well since the global scope is set to 'Defer'. */ 
  engine.block.isAllowedByScope(image, 'design/arrange');
  // highlight-isAllowedByScope
});
