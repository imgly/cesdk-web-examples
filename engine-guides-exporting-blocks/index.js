import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.59.2/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.59.2/assets'
};

const exportButton = document.getElementById('export_button');

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  exportButton.removeAttribute('disabled');

  exportButton.onclick = async () => {
    /* Export scene as PNG image. */
    const scene = engine.scene.get();
    /* Optionally, the maximum supported export size can be checked before exporting. */
    const maxExportSizeInPixels = engine.editor.getMaxExportSize();
    /* Optionally, the compression level and the target size can be specified. */
    const options = {
      mimeType: 'image/png',
      pngCompressionLevel: 9,
      targetWidth: null,
      targetHeight: null
    };
    const blob = await engine.block.export(scene, options);

    /* Download blob. */
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'export.png';
    anchor.click();
  };
});
