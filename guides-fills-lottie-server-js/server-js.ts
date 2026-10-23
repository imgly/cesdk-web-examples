import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Lottie Fills
 *
 * Demonstrates how to play a Lottie animation as the fill of a block:
 * - Writing a Lottie document that references an image by URL
 * - Setting the document as the file of a video fill
 * - Waiting until the Lottie and its image are loaded
 * - Exporting one frame of the animation
 * - Handling a file that is not a Lottie
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a 3 second page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1000);
    engine.block.setHeight(page, 1000);
    engine.block.appendChild(scene, page);
    engine.block.setDuration(page, 3);

    // A 3 second Lottie at 30 frames per second. Its image layer fades in a
    // photo and zooms into it. The asset names the photo by an absolute URL.
    const lottie = {
      v: '5.7.0',
      fr: 30,
      ip: 0,
      op: 90,
      w: 1000,
      h: 1000,
      assets: [
        {
          id: 'photo',
          w: 2500,
          h: 1667,
          u: '',
          p: 'https://img.ly/static/ubq_samples/sample_1.jpg',
          e: 0
        }
      ],
      layers: [
        {
          ty: 2,
          refId: 'photo',
          ip: 0,
          op: 90,
          st: 0,
          ks: {
            a: { a: 0, k: [1250, 833] },
            p: { a: 0, k: [500, 500] },
            s: {
              a: 1,
              k: [
                { t: 0, s: [60, 60] },
                { t: 90, s: [80, 80] }
              ]
            },
            o: {
              a: 1,
              k: [
                { t: 0, s: [0] },
                { t: 30, s: [100] }
              ]
            }
          }
        }
      ]
    };

    // A buffer holds the document in memory and gives it a URI
    const lottieURI = engine.editor.createBuffer();
    const bytes = new TextEncoder().encode(JSON.stringify(lottie));
    engine.editor.setBufferData(lottieURI, 0, bytes);

    // A video fill plays the Lottie. Set a hosted .json or .lottie URL the same way.
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 1000);
    engine.block.setHeight(block, 1000);
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', lottieURI);
    engine.block.setFill(block, fill);
    engine.block.appendChild(page, block);
    engine.block.setDuration(block, 3);

    // The load finishes when the Lottie and the images it references are loaded
    await engine.block.forceLoadAVResource(fill);
    console.log(engine.block.getAVResourceTotalDuration(fill)); // 3

    // Seek the page to 1.5 seconds and export that frame
    engine.block.setPlaybackTime(page, 1.5);
    const frame = await engine.block.export(page, { mimeType: 'image/png' });
    mkdirSync('output', { recursive: true });
    writeFileSync(
      'output/lottie-frame.png',
      Buffer.from(await frame.arrayBuffer())
    );
    console.log('Frame saved to output/lottie-frame.png');

    // A file that is not a Lottie or a video does not load
    const brokenURI = engine.editor.createBuffer();
    engine.editor.setBufferData(
      brokenURI,
      0,
      new TextEncoder().encode('not a Lottie')
    );
    const brokenFill = engine.block.createFill('video');
    engine.block.setString(brokenFill, 'fill/video/fileURI', brokenURI);
    try {
      await engine.block.forceLoadAVResource(brokenFill);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'EDITOR.RESOURCE_LOAD_FAILED'
    }
    engine.block.destroy(brokenFill);
    engine.editor.destroyBuffer(brokenURI);
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
