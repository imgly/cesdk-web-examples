import CreativeEngine, { DesignBlockId } from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Create a Collage (Server/Node.js)
 *
 * This example demonstrates how to create collages programmatically:
 * 1. Creating a scene with images
 * 2. Loading a layout scene file
 * 3. Transferring content from the original scene to the layout
 * 4. Exporting the final collage
 */

// Sort blocks by visual position (top-to-bottom, left-to-right)
// This ensures consistent content mapping between layouts
function visuallySortBlocks(
  engine: CreativeEngine,
  blocks: DesignBlockId[]
): DesignBlockId[] {
  return blocks
    .map((block) => ({
      block,
      x: Math.round(engine.block.getPositionX(block)),
      y: Math.round(engine.block.getPositionY(block))
    }))
    .sort((a, b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
    })
    .map((item) => item.block);
}

// Recursively collect all descendant blocks
function getChildrenTree(
  engine: CreativeEngine,
  blockId: DesignBlockId
): DesignBlockId[] {
  const children = engine.block.getChildren(blockId);
  const result: DesignBlockId[] = [];
  for (const child of children) {
    result.push(child);
    result.push(...getChildrenTree(engine, child));
  }
  return result;
}

async function run() {
  let engine: CreativeEngine | undefined;

  try {
    const config = {
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');

    // Create a scene with images to arrange in a collage
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions for the collage
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1080);

    // Add sample images to the page
    const imageUrls = [
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(
        imageFill,
        'fill/image/imageFileURI',
        imageUrls[i]
      );
      engine.block.setFill(graphic, imageFill);

      // Position images in a simple grid (will be rearranged by layout)
      engine.block.setPositionX(graphic, (i % 2) * 540);
      engine.block.setPositionY(graphic, Math.floor(i / 2) * 540);
      engine.block.setWidth(graphic, 540);
      engine.block.setHeight(graphic, 540);

      engine.block.appendChild(page, graphic);
    }

    console.log(`✓ Scene created with ${imageUrls.length} images`);

    // Load a layout template that defines the collage structure
    // The layout contains positioned placeholder blocks
    const layoutUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_collage_1.scene';

    const layoutSceneString = await fetch(layoutUrl).then((res) => res.text());
    const layoutBlocks = await engine.block.loadFromString(layoutSceneString);
    const layoutPage = layoutBlocks[0];

    console.log('✓ Layout template loaded');

    // Collect image blocks from both pages
    const sourceBlocks = getChildrenTree(engine, page);
    const sourceImages = sourceBlocks.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedSourceImages = visuallySortBlocks(engine, sourceImages);

    const layoutChildren = getChildrenTree(engine, layoutPage);
    const layoutImages = layoutChildren.filter(
      (id) => engine!.block.getKind(id) === 'image'
    );
    const sortedLayoutImages = visuallySortBlocks(engine, layoutImages);

    console.log(
      `✓ Found ${sortedSourceImages.length} source images, ${sortedLayoutImages.length} layout slots`
    );

    // Transfer image content from source to layout positions
    const transferCount = Math.min(
      sortedSourceImages.length,
      sortedLayoutImages.length
    );

    for (let i = 0; i < transferCount; i++) {
      const sourceBlock = sortedSourceImages[i];
      const targetBlock = sortedLayoutImages[i];

      // Get the source image fill
      const sourceFill = engine.block.getFill(sourceBlock);
      const targetFill = engine.block.getFill(targetBlock);

      // Transfer the image URI
      const imageUri = engine.block.getString(
        sourceFill,
        'fill/image/imageFileURI'
      );
      engine.block.setString(targetFill, 'fill/image/imageFileURI', imageUri);

      // Transfer source sets if present
      try {
        const sourceSet = engine.block.getSourceSet(
          sourceFill,
          'fill/image/sourceSet'
        );
        if (sourceSet.length > 0) {
          engine.block.setSourceSet(
            targetFill,
            'fill/image/sourceSet',
            sourceSet
          );
        }
      } catch {
        // Source set not available, skip
      }

      // Reset crop to fill the new frame dimensions
      engine.block.resetCrop(targetBlock);

      // Transfer placeholder behavior if supported
      if (engine.block.supportsPlaceholderBehavior(sourceBlock)) {
        engine.block.setPlaceholderBehaviorEnabled(
          targetBlock,
          engine.block.isPlaceholderBehaviorEnabled(sourceBlock)
        );
      }
    }

    console.log(`✓ Transferred ${transferCount} images to layout`);

    // Transfer text content (if both scenes have text blocks)
    const sourceTexts = sourceBlocks.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );
    const layoutTexts = layoutChildren.filter(
      (id) => engine!.block.getType(id) === '//ly.img.ubq/text'
    );

    const sortedSourceTexts = visuallySortBlocks(engine, sourceTexts);
    const sortedLayoutTexts = visuallySortBlocks(engine, layoutTexts);

    const textTransferCount = Math.min(
      sortedSourceTexts.length,
      sortedLayoutTexts.length
    );

    for (let i = 0; i < textTransferCount; i++) {
      const sourceText = sortedSourceTexts[i];
      const targetText = sortedLayoutTexts[i];

      // Transfer text content
      const text = engine.block.getString(sourceText, 'text/text');
      engine.block.setString(targetText, 'text/text', text);

      // Transfer font
      const fontUri = engine.block.getString(sourceText, 'text/fontFileUri');
      const typeface = engine.block.getTypeface(sourceText);
      engine.block.setFont(targetText, fontUri, typeface);

      // Transfer text color
      const textColor = engine.block.getColor(sourceText, 'fill/solid/color');
      engine.block.setColor(targetText, 'fill/solid/color', textColor);
    }

    if (textTransferCount > 0) {
      console.log(`✓ Transferred ${textTransferCount} text blocks`);
    }

    // Export the final collage
    // Use the layout page dimensions for the export
    const layoutWidth = engine.block.getWidth(layoutPage);
    const layoutHeight = engine.block.getHeight(layoutPage);

    const blob = await engine.block.export(layoutPage, {
      mimeType: 'image/png',
      targetWidth: layoutWidth,
      targetHeight: layoutHeight
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('collage-output.png', buffer);
    console.log(
      `✓ Exported collage to collage-output.png (${layoutWidth}x${layoutHeight})`
    );

    // Clean up temporary blocks
    engine.block.destroy(page);
    console.log('✓ Cleanup completed');

    console.log('\n✓ Collage created successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Always dispose the engine
    engine?.dispose();
    console.log('\n✓ Engine disposed');
  }
}

// Run the example
run();
