// highlight-import
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/cesdk-engine.umd.js';

// highlight-setup
const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/assets'
};

CreativeEngine.init(document.getElementById('cesdk_canvas'), config).then(
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
