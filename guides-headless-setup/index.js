// highlight-import
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-rc.0/index.js';
// highlight-import-npm
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';
// highlight-import-npm

// highlight-setup
const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-rc.0/assets'
};

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(
  // highlight-setup
  async (instance) => {
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
      instance.dispose();
    }
    // highlight-dispose
  }
);
