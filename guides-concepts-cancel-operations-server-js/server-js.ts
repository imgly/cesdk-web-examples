import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const IMAGE_URL = 'https://img.ly/static/ubq_samples/sample_1.jpg';
const SCENE_URL =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // An image fill instead of addImage(), because addImage() waits for the download.
    // An export with nothing to wait for ends inside its call, before the abort.
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setString(imageFill, 'fill/image/imageFileURI', IMAGE_URL);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);
    engine.block.appendChild(page, imageBlock);

    const controller = new AbortController();
    const exporting = engine.block.export(page, {
      mimeType: 'image/png',
      abortSignal: controller.signal
    });
    controller.abort();

    try {
      await exporting;
      console.log('The export ended before the abort');
    } catch (error) {
      // Logs "AbortSignal received"
      console.log('The export stopped:', (error as Error).message);
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    console.log(`The next export made a PNG file of ${blob.size} bytes`);

    const deadline = AbortSignal.timeout(10_000);
    try {
      await engine.scene.load(SCENE_URL, { abortSignal: deadline });
      console.log('The scene loaded in time');
    } catch (error) {
      if (!deadline.aborted) {
        throw error;
      }
      console.log('The scene did not load within 10 seconds');
    }
  } finally {
    engine.dispose();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
