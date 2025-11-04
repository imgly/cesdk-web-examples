import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Fill features are enabled by default in CE.SDK
    // You can check and control fill feature availability:
    const isFillEnabled = cesdk.feature.isEnabled('ly.img.fill', {
      engine: cesdk.engine
    });
    console.log('Fill feature enabled:', isFillEnabled);

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 9);
    const { blockWidth, blockHeight, getPosition } = layout;

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const blockSize = { width: blockWidth, height: blockHeight };

    // ===== Section 1: Check Fill Support =====
    // Check if a block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);
    engine.block.destroy(testBlock);

    // ===== Section 2: Create and Apply Image Fill =====
    // Create a new image fill using the convenience API
    const coverImageBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, coverImageBlock);

    // Or create manually for more control
    const manualBlock = engine.block.create('graphic');
    engine.block.setShape(manualBlock, engine.block.createShape('rect'));
    engine.block.setWidth(manualBlock, blockWidth);
    engine.block.setHeight(manualBlock, blockHeight);

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

    // ===== Section 3: Content Fill Modes =====
    // Cover mode: Fill entire block, may crop image
    const coverBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: blockSize
      }
    );
    engine.block.appendChild(page, coverBlock);
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Contain mode: Fit entire image, may leave empty space
    const containBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      {
        size: blockSize
      }
    );
    engine.block.appendChild(page, containBlock);
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Get current fill mode
    const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
    console.log('Current fill mode:', currentMode);

    // ===== Section 4: Source Sets (Responsive Images) =====
    // Use source sets for responsive images
    const responsiveBlock = engine.block.create('graphic');
    engine.block.setShape(responsiveBlock, engine.block.createShape('rect'));
    engine.block.setWidth(responsiveBlock, blockWidth);
    engine.block.setHeight(responsiveBlock, blockHeight);

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

    // ===== Section 5: Data URI / Base64 Images =====
    // Use data URI for embedded images (small SVG example)
    const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#4CAF50"/>
        <text x="50" y="55" text-anchor="middle" fill="white" font-size="20" font-weight="bold">SVG</text>
      </svg>`;
    const svgDataUri = `data:image/svg+xml;base64,${btoa(svgContent)}`;

    const dataUriBlock = engine.block.create('graphic');
    engine.block.setShape(dataUriBlock, engine.block.createShape('rect'));
    engine.block.setWidth(dataUriBlock, blockWidth);
    engine.block.setHeight(dataUriBlock, blockHeight);

    const dataUriFill = engine.block.createFill('image');
    engine.block.setString(dataUriFill, 'fill/image/imageFileURI', svgDataUri);
    engine.block.setFill(dataUriBlock, dataUriFill);
    engine.block.appendChild(page, dataUriBlock);

    // ===== Section 6: Sharing Fills =====
    // Create one fill and share it between multiple blocks
    const sharedFill = engine.block.createFill('image');
    engine.block.setString(
      sharedFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_5.jpg'
    );

    // Apply to first block
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, blockWidth);
    engine.block.setHeight(sharedBlock1, blockHeight);
    engine.block.setFill(sharedBlock1, sharedFill);
    engine.block.appendChild(page, sharedBlock1);

    // Apply to second block (shares the same fill)
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, blockWidth);
    engine.block.setHeight(sharedBlock2, blockHeight);
    engine.block.setFill(sharedBlock2, sharedFill);
    engine.block.appendChild(page, sharedBlock2);

    // ===== Section 7: Opacity =====
    // Control opacity for transparency effects
    const opacityBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: blockSize
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
      sharedBlock1, // Position 6
      sharedBlock2, // Position 7
      opacityBlock // Position 8
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Zoom to show all content
    await engine.scene.zoomToBlock(page);
  }
}

export default Example;
