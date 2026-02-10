import CreativeEngine from '@cesdk/node';
import fs from 'fs/promises';

// Configuration for the engine
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY',
  userId: 'guides-user'
};

CreativeEngine.init(config).then(async (engine) => {
  console.log('CE.SDK Engine initialized');

  try {
    await engine.addDefaultAssetSources();
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v4/ly.img.templates/social/instagram_photo_1.scene'
    );

    const [page] = engine.block.findByType('page');

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const arrayBuffer = await blob.arrayBuffer();

    await fs.writeFile('./example-output.png', Buffer.from(arrayBuffer));
    console.log('Export completed: example-output.png');
  } catch (error) {
    console.error('Error processing scene:', error);
  } finally {
    engine.dispose();
  }
});
