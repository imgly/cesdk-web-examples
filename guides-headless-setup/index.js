// highlight-import
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.6.0-alpha.1/cesdk-engine.umd.js';

// highlight-setup
const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.6.0-alpha.1/assets'
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
