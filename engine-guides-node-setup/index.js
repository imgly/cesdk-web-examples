import fs from 'fs/promises';
import { Buffer } from 'buffer';
import CreativeEngine from '@cesdk/node';


const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
};

CreativeEngine.init(config).then(async (engine) => {
  await engine.addDefaultAssetSources();
  engine.scene
    .loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    )
    .then(() => {
      const [page] = engine.block.findByType('page');
      return engine.block.export(page, { mimeType: 'image/png' });
    })
    .then((blob) => blob.arrayBuffer())
    .then((arrayBuffer) =>
      fs.writeFile('./example-output.png', Buffer.from(arrayBuffer))
    )
    .finally(() => {
      engine.dispose();
    });
});
