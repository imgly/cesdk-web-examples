import CreativeEngine, {
  supportsWasm
} from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.1/index.js';
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.1/assets'
};

if (
  supportsWasm()
  // If you use video in your scene you can check if the browser supports it as well.
  // supportsVideo()
) {
  CreativeEngine.init(config).then(
    async (engine) => {
      document.getElementById('cesdk_container').append(engine.element);

      // Add default asset sources to the engine.
      await engine.addDefaultAssetSources();
      await engine.scene.loadFromURL(
        'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
      );

      engine.block.findByType('//ly.img.ubq/text').forEach((id) => {
        engine.block.setOpacity(id, 0.5);
      });

      engine.element.remove();
      engine.dispose();
    }
  );
} else {
  alert('Unsupported browser detected');
}
