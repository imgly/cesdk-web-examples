const fs = require('fs/promises');
// highlight-require
const CreativeEngine = require('@cesdk/node');

const { DesignBlockType, MimeType } = CreativeEngine;
// highlight-require

// highlight-use
const config = {
  // license: "YOUR_LICENSE_KEY"
};

CreativeEngine.init(config).then((engine) => {
  engine.scene
    .loadFromURL(
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene'
    )
    .then(() => {
      const [page] = engine.block.findByType(DesignBlockType.Page);
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
// highlight-use
