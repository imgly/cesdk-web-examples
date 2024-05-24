// highlight-import
import CreativeEngine, {
  supportsWasm
} from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.28.0-rc.0/index.js';
// highlight-import-npm
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';
// highlight-import-npm

// highlight-setup
const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.28.0-rc.0/assets'
};

if (
  supportsWasm()
  // If you use video in your scene you can check if the browser supports it as well.
  // supportsVideo()
) {
  CreativeEngine.init(config).then(
    // highlight-setup
    async (engine) => {
      document.getElementById('cesdk_container').append(engine.element);

      // highlight-work
      // Add default asset sources to the engine.
      await engine.addDefaultAssetSources();
      await engine.scene.loadFromURL(
        'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
      );

      engine.block.findByType('//ly.img.ubq/text').forEach((id) => {
        engine.block.setOpacity(id, 0.5);
      });
      // highlight-work

      // highlight-dispose
      engine.element.remove();
      engine.dispose();
      // highlight-dispose
    }
  );
} else {
  alert('Unsupported browser detected');
}
