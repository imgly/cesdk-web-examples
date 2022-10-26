// highlight-import
import CreativeEngine, {
  supportsWasm,
  supportsVideo
} from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0-preview.0/index.js';
// highlight-import-npm
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';
// highlight-import-npm

// highlight-setup
const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0-preview.0/assets'
};

if (
  supportsWasm()
  // If you use video in your scene you can check if the browser supports it as well.
  // supportsVideo()
) {
  CreativeEngine.init(config).then(
    // highlight-setup
    async (instance) => {
      document.getElementById('root').append(instance.element);
      // highlight-work
      await instance.scene.loadFromURL(
        'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
      );

      instance.block.findByType('//ly.img.ubq/text').forEach((id) => {
        instance.block.destroy(id);
      });
      // highlight-work

      // highlight-dispose
      function shutdownCreativeEngine() {
        instance.element.remove();
        instance.dispose();
      }
      // highlight-dispose
    }
  );
} else {
  alert('Unsupported browser detected');
}
