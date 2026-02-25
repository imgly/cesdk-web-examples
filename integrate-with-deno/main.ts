// @deno-types="npm:@cesdk/node"
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';
import CreativeEngine from 'npm:@cesdk/node';

// Fix for TypeScript type resolution in Deno
const { MimeType } = CreativeEngine as any;

// CE.SDK configuration
const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY',
  userId: 'guides-user'
};

CreativeEngine.init(config).then(async (engine) => {
  console.log('CE.SDK Engine initialized (Deno)');

  try {
    await engine.addDefaultAssetSources();

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v4/ly.img.templates/social/instagram_photo_1.scene'
    );

    const [page] = engine.block.findByType('page');

    const blob = await engine.block.export(page, MimeType.Png);
    const arrayBuffer = await blob.arrayBuffer();

    await writeFile('./example-output.png', Buffer.from(arrayBuffer));
    console.log('Export completed: example-output.png');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    engine.dispose();
  }
});
