const fs = require('fs/promises');
const CreativeEngine = require('@cesdk/node');

const { MimeType } = CreativeEngine;

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-node/1.41.1-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  await engine.addDefaultAssetSources();
  engine.scene
    .loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    )
    .then(() => {
      const [page] = engine.block.findByType('page');
      return engine.block.export(page, MimeType.Png);
    })
    .then((blob) => blob.arrayBuffer())
    .then((arrayBuffer) =>
      fs.writeFile('./example-output.png', Buffer.from(arrayBuffer))
    )
    .finally(() => {
      engine.dispose();
    });
});
