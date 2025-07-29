import fs from 'fs/promises';
import CreativeEngine from '@cesdk/node';

const { MimeType } = CreativeEngine;

// Configuration for the engine
const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-node/1.57.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  console.log('CE.SDK Engine initialized');

  try {
    await engine.addDefaultAssetSources();
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene'
    );

    const [page] = engine.block.findByType('page');

    const blob = await engine.block.export(page, MimeType.Png);
    const arrayBuffer = await blob.arrayBuffer();

    await fs.writeFile('./example-output.png', Buffer.from(arrayBuffer));
    console.log('Export completed: example-output.png');
  } catch (error) {
    console.error('Error processing scene:', error);
  } finally {
    engine.dispose();
  }
});