import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0-rc.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0-rc.0/assets'
};

const exportButton = document.getElementById('export_button');

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(
  async (instance) => {
    await instance.scene.loadFromURL('https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-rc.0/assets/templates/cesdk_postcard_1.scene');
    exportButton.removeAttribute('disabled');

    exportButton.onclick = async () => {
      /* Export scene as PNG image. */
      const scene = instance.scene.get();
      const mimeType = 'image/png';
      const options = { pngCompressionLevel: 9 };
      const blob = await instance.block.export(scene, mimeType, options);

      /* Download blob. */
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = 'export.png';
      anchor.click();
    }
  }
);
