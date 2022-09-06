// highlight-import
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0-alpha.4/index.js';
// highlight-import-npm
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';
// highlight-import-npm

// highlight-setup
const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0-alpha.4/assets'
};

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
