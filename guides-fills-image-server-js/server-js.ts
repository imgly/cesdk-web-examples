import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Check if block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);
    engine.block.destroy(testBlock);

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // ===== Section 1: Create Image Fill with Convenience API =====
    // Create a new image fill using the convenience API
    const coverImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, coverImageBlock);

    // Or create manually for more control
    const manualBlock = engine.block.create('graphic');
    engine.block.setShape(manualBlock, engine.block.createShape('rect'));
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    engine.block.setFill(manualBlock, imageFill);
    engine.block.appendChild(page, manualBlock);

    // Get the current fill from a block
    const currentFill = engine.block.getFill(coverImageBlock);
    const fillType = engine.block.getType(currentFill);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/image'

    // ===== Section 2: Content Fill Modes =====
    // Cover mode: Fill entire block, may crop image
    const coverBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 200, height: 150 }
      }
    );
    engine.block.appendChild(page, coverBlock);
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Contain mode: Fit entire image, may leave empty space
    const containBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      {
        size: { width: 200, height: 150 }
      }
    );
    engine.block.appendChild(page, containBlock);
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Get current fill mode
    const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
    console.log('Current fill mode:', currentMode);

    // ===== Section 3: Source Sets (Responsive Images) =====
    // Use source sets for responsive images
    const responsiveBlock = engine.block.create('graphic');
    engine.block.setShape(responsiveBlock, engine.block.createShape('rect'));
    engine.block.setWidth(responsiveBlock, 200);
    engine.block.setHeight(responsiveBlock, 150);

    const responsiveFill = engine.block.createFill('image');
    engine.block.setSourceSet(responsiveFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 512,
        height: 341
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 1024,
        height: 683
      },
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        width: 2048,
        height: 1366
      }
    ]);
    engine.block.setFill(responsiveBlock, responsiveFill);
    engine.block.appendChild(page, responsiveBlock);

    // Get current source set
    const sourceSet = engine.block.getSourceSet(
      responsiveFill,
      'fill/image/sourceSet'
    );
    console.log('Source set entries:', sourceSet.length);

    // ===== Section 4: Data URI / Base64 Images =====
    // Use data URI for embedded images
    // Fetch an image and convert to base64 data URI
    const imageResponse = await fetch(
      'https://img.ly/static/ubq_samples/thumbnails/sample_1.jpg'
    );
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64Image = imageBuffer.toString('base64');
    const imageDataUri = `data:image/jpeg;base64,${base64Image}`;

    const dataUriBlock = engine.block.create('graphic');
    engine.block.setShape(dataUriBlock, engine.block.createShape('rect'));
    engine.block.setWidth(dataUriBlock, 200);
    engine.block.setHeight(dataUriBlock, 150);

    const dataUriFill = engine.block.createFill('image');
    engine.block.setString(dataUriFill, 'fill/image/imageFileURI', imageDataUri);
    engine.block.setFill(dataUriBlock, dataUriFill);
    engine.block.appendChild(page, dataUriBlock);

    // ===== Section 5: Opacity =====
    // Control opacity for transparency effects
    const opacityBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 200, height: 150 }
      }
    );
    engine.block.appendChild(page, opacityBlock);
    engine.block.setFloat(opacityBlock, 'opacity', 0.6);

    // ===== Position all blocks in grid layout =====
    const blocks = [
      coverImageBlock, // Position 0
      manualBlock, // Position 1
      coverBlock, // Position 2
      containBlock, // Position 3
      responsiveBlock, // Position 4
      dataUriBlock, // Position 5
      opacityBlock // Position 6
    ];

    // Position blocks in a grid layout
    const cols = 3;
    const spacing = 10;
    const margin = 50;
    const blockWidth = 200;
    const blockHeight = 150;

    blocks.forEach((block, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      engine.block.setPositionX(block, margin + col * (blockWidth + spacing));
      engine.block.setPositionY(block, margin + row * (blockHeight + spacing));
    });

    // Export the result
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output');
    }

    writeFileSync('./output/image-fills.png', buffer);
    console.log('Exported to ./output/image-fills.png');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
