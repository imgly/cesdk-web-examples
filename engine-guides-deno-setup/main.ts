import CreativeEngine from '@cesdk/node';

// Retrieve the license key from the .env file
const license = Deno.env.get('CESDK_LICENSE');

const config = {
  license,
  userId: 'guides-user'
};

CreativeEngine.init(config).then(async (engine) => {
  await engine.addDefaultAssetSources();
  engine.scene
    .loadFromURL(`file://${import.meta.dirname}/demo.scene`)
    .then(() => {
      const [page] = engine.block.findByType('page');
      return engine.block.export(page, { mimeType: 'image/png' });
    })
    .then((blob) => blob.arrayBuffer())
    .then((arrayBuffer) => {
      Deno.writeFile('./example-output.png', new Uint8Array(arrayBuffer));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      engine.dispose();
    });
});

