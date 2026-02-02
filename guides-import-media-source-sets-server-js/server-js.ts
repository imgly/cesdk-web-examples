import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // ===== Section 1: Setting a Source Set on an Image Fill =====
    // Create a graphic block with an image fill
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));

    // Create an image fill and configure source set with multiple resolutions
    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      // Placeholder images display their dimensions
      { uri: 'https://placehold.co/256x256/png', width: 256, height: 256 },
      { uri: 'https://placehold.co/512x512/png', width: 512, height: 512 },
      { uri: 'https://placehold.co/1024x1024/png', width: 1024, height: 1024 }
    ]);
    engine.block.setFill(imageBlock, imageFill);

    // Position and size the block
    engine.block.setWidth(imageBlock, 300);
    engine.block.setHeight(imageBlock, 300);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 50);
    engine.block.appendChild(page, imageBlock);

    // ===== Section 2: Querying and Modifying Source Sets =====
    // Query the existing source set
    const sourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Current source set:', sourceSet);

    // Add a new high-resolution source dynamically
    // The dimensions are determined automatically from the image
    await engine.block.addImageFileURIToSourceSet(
      imageFill,
      'fill/image/sourceSet',
      'https://placehold.co/2048x2048/png'
    );

    // Verify the source was added
    const updatedSourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    console.log('Updated source set with 2048px source:', updatedSourceSet);

    // ===== Section 3: Using Source Sets in Asset Definitions =====
    // Define an asset with a source set in its payload
    const assetDefinition = {
      id: 'multi-resolution-image',
      label: { en: 'Multi-Resolution Image' },
      meta: {
        kind: 'image',
        fillType: '//ly.img.ubq/fill/image'
      },
      payload: {
        sourceSet: [
          {
            uri: 'https://placehold.co/256x256/4a90d9/white/png?text=256',
            width: 256,
            height: 256
          },
          {
            uri: 'https://placehold.co/512x512/4a90d9/white/png?text=512',
            width: 512,
            height: 512
          },
          {
            uri: 'https://placehold.co/1024x1024/4a90d9/white/png?text=1024',
            width: 1024,
            height: 1024
          }
        ]
      }
    };

    // Register the asset with a local source
    await engine.asset.addLocalSource('my-images');
    engine.asset.addAssetToSource('my-images', assetDefinition);

    // Find the asset from the source for applying
    const findResult = await engine.asset.findAssets('my-images', {
      page: 0,
      perPage: 1
    });
    const assetResult = findResult.assets[0];

    // Apply the asset - the source set is automatically configured
    const assetBlock = await engine.asset.defaultApplyAsset(assetResult);
    if (assetBlock === undefined) {
      throw new Error('Failed to apply asset');
    }

    // Verify the source set was applied to the block's fill
    const assetFill = engine.block.getFill(assetBlock);
    const assetSourceSet = engine.block.getSourceSet(
      assetFill,
      'fill/image/sourceSet'
    );
    console.log('Asset source set applied:', assetSourceSet);

    // Position the asset block
    engine.block.setWidth(assetBlock, 300);
    engine.block.setHeight(assetBlock, 300);
    engine.block.setPositionX(assetBlock, 400);
    engine.block.setPositionY(assetBlock, 50);

    // ===== Section 4: Video Source Sets =====
    // Create a graphic block with a video fill
    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));

    // Create a video fill and configure source set
    const videoFill = engine.block.createFill('video');
    engine.block.setSourceSet(videoFill, 'fill/video/sourceSet', [
      {
        uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
        width: 1920,
        height: 1080
      }
    ]);
    engine.block.setFill(videoBlock, videoFill);

    // Add a higher resolution source dynamically
    await engine.block.addVideoFileURIToSourceSet(
      videoFill,
      'fill/video/sourceSet',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
    );

    // Position and size the video block
    engine.block.setWidth(videoBlock, 400);
    engine.block.setHeight(videoBlock, 225);
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 400);
    engine.block.appendChild(page, videoBlock);

    // ===== Section 5: Video Preview Quality Settings =====
    // Force low-quality video preview during editing for better performance
    // Export will still use the highest quality source available
    engine.editor.setSettingBool('features/forceLowQualityVideoPreview', true);

    // Export the page to verify the result
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output');
    }

    writeFileSync('./output/source-sets-result.png', buffer);
    console.log('Exported to ./output/source-sets-result.png');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
