import type { EditorPlugin,EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Blocks Guide
 *
 * Demonstrates working with blocks in CE.SDK:
 * - Block types (graphic, text, audio, page, cutout)
 * - Block hierarchy (parent-child relationships)
 * - Block lifecycle (create, duplicate, destroy)
 * - Block properties and reflection
 * - Selection and visibility
 * - Block state management
 * - Serialization (save/load)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the current scene and page
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    // Find the page block - pages contain all design elements
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Set page dimensions to accommodate our blocks
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Query the block type - returns the full type path
    const pageType = engine.block.getType(page);
    console.log('Page block type:', pageType); // '//ly.img.ubq/page'

    // Type is immutable, determined at creation
    // Kind is a custom label you can set and change
    engine.block.setKind(page, 'main-canvas');
    const pageKind = engine.block.getKind(page);
    console.log('Page kind:', pageKind); // 'main-canvas'

    // Find blocks by kind
    const mainCanvasBlocks = engine.block.findByKind('main-canvas');
    console.log('Blocks with kind "main-canvas":', mainCanvasBlocks.length);

    // Create a graphic block for an image
    const graphic = engine.block.create('graphic');

    // Duplicate creates a copy with a new UUID
    const graphicCopy = engine.block.duplicate(graphic);

    // Destroy removes a block - the duplicate is no longer needed
    engine.block.destroy(graphicCopy);

    // Check if a block ID is still valid after operations
    const isOriginalValid = engine.block.isValid(graphic);
    const isCopyValid = engine.block.isValid(graphicCopy);
    console.log('Original valid:', isOriginalValid); // true
    console.log('Copy valid after destroy:', isCopyValid); // false

    // Create a rect shape to define the graphic's bounds
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    // Position and size the graphic (centered horizontally on 800px page)
    engine.block.setPositionX(graphic, 200);
    engine.block.setPositionY(graphic, 100);
    engine.block.setWidth(graphic, 400);
    engine.block.setHeight(graphic, 300);

    // Create an image fill and attach it to the graphic
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);

    // Set content fill mode so the image fills the block bounds
    engine.block.setEnum(graphic, 'contentFill/mode', 'Cover');

    // Blocks form a tree: scene > page > elements
    // Append the graphic to the page to make it visible
    engine.block.appendChild(page, graphic);

    // Query parent-child relationships
    const graphicParent = engine.block.getParent(graphic);
    console.log('Graphic parent is page:', graphicParent === page); // true

    const pageChildren = engine.block.getChildren(page);
    console.log('Page has children:', pageChildren.length);

    // Create a text block with content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position the text block (centered horizontally on 800px page)
    engine.block.setPositionX(textBlock, 200);
    engine.block.setPositionY(textBlock, 450);
    engine.block.setWidth(textBlock, 400);
    engine.block.setHeight(textBlock, 80);

    // Set text content
    engine.block.setString(
      textBlock,
      'text/text',
      'Blocks are the building units of CE.SDK designs'
    );

    // Set font size to 72pt
    engine.block.setFloat(textBlock, 'text/fontSize', 72);

    // Center-align the text
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');

    // Check the text block type
    const textType = engine.block.getType(textBlock);
    console.log('Text block type:', textType); // '//ly.img.ubq/text'

    // Use reflection to discover available properties
    const graphicProperties = engine.block.findAllProperties(graphic);
    console.log('Graphic block has', graphicProperties.length, 'properties');

    // Get property type information
    const opacityType = engine.block.getPropertyType('opacity');
    console.log('Opacity property type:', opacityType); // 'Float'

    // Check if properties are readable/writable
    const isOpacityReadable = engine.block.isPropertyReadable('opacity');
    const isOpacityWritable = engine.block.isPropertyWritable('opacity');
    console.log(
      'Opacity readable:',
      isOpacityReadable,
      'writable:',
      isOpacityWritable
    );

    // Use type-specific getters and setters
    // Float properties
    engine.block.setFloat(graphic, 'opacity', 0.9);
    const opacity = engine.block.getFloat(graphic, 'opacity');
    console.log('Graphic opacity:', opacity);

    // Bool properties
    engine.block.setBool(page, 'page/marginEnabled', false);
    const marginEnabled = engine.block.getBool(page, 'page/marginEnabled');
    console.log('Page margin enabled:', marginEnabled);

    // Enum properties - get allowed values first
    const blendModes = engine.block.getEnumValues('blend/mode');
    console.log(
      'Available blend modes:',
      blendModes.slice(0, 3).join(', '),
      '...'
    );

    engine.block.setEnum(graphic, 'blend/mode', 'Multiply');
    const blendMode = engine.block.getEnum(graphic, 'blend/mode');
    console.log('Graphic blend mode:', blendMode);

    // Each block has a stable UUID across save/load cycles
    const graphicUUID = engine.block.getUUID(graphic);
    console.log('Graphic UUID:', graphicUUID);

    // Block names are mutable labels for organization
    engine.block.setName(graphic, 'Hero Image');
    engine.block.setName(textBlock, 'Caption');

    const graphicName = engine.block.getName(graphic);
    console.log('Graphic name:', graphicName); // 'Hero Image'

    // Select a block programmatically
    engine.block.select(graphic); // Selects graphic, deselects others

    // Check selection state
    const isGraphicSelected = engine.block.isSelected(graphic);
    console.log('Graphic is selected:', isGraphicSelected); // true

    // Add to selection without deselecting others
    engine.block.setSelected(textBlock, true);

    // Get all selected blocks
    const selectedBlocks = engine.block.findAllSelected();
    console.log('Selected blocks count:', selectedBlocks.length); // 2

    // Subscribe to selection changes
    const unsubscribeSelection = engine.block.onSelectionChanged(() => {
      const selected = engine.block.findAllSelected();
      console.log(
        'Selection changed, now selected:',
        selected.length,
        'blocks'
      );
    });

    // Control block visibility
    engine.block.setVisible(graphic, true);
    const isVisible = engine.block.isVisible(graphic);
    console.log('Graphic is visible:', isVisible);

    // Control export inclusion
    engine.block.setIncludedInExport(graphic, true);
    const inExport = engine.block.isIncludedInExport(graphic);
    console.log('Graphic included in export:', inExport);

    // Control clipping behavior
    engine.block.setClipped(graphic, false);
    const isClipped = engine.block.isClipped(graphic);
    console.log('Graphic is clipped:', isClipped);

    // Query block state - indicates loading status
    const graphicState = engine.block.getState(graphic);
    console.log('Graphic state:', graphicState.type); // 'Ready', 'Pending', or 'Error'

    // Subscribe to state changes (useful for loading indicators)
    const unsubscribeState = engine.block.onStateChanged(
      [graphic],
      (changedBlocks) => {
        for (const blockId of changedBlocks) {
          const state = engine.block.getState(blockId);
          console.log(`Block ${blockId} state changed to:`, state.type);
          if (state.type === 'Pending' && state.progress !== undefined) {
            console.log(
              'Loading progress:',
              Math.round(state.progress * 100) + '%'
            );
          }
        }
      }
    );

    // Save blocks to a string for persistence
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const savedString = await engine.block.saveToString(
      [graphic, textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );
    console.log('Blocks saved to string, length:', savedString.length);

    // Alternatively, blocks can also be saved with their assets to an archive
    // const savedBlocksArchive = await engine.block.saveToArchive([
    //   graphic,
    //   textBlock
    // ]);

    // Load blocks from string (creates new blocks, not attached to scene)
    const loadedBlocks = await engine.block.loadFromString(savedString);
    console.log('Loaded blocks from string:', loadedBlocks.length);

    // Alternatively, blocks can also be loaded from an archive
    // const loadedBlocks = await engine.block.loadFromArchiveURL(
    //   'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1_blocks.zip'
    // );
    // console.log('Loaded blocks from archive URL:', loadedBlocks.length);

    // Alternatively, blocks can be loaded from an extracted zip file created with block.saveToArchive
    // const loadedBlocks = await engine.block.loadFromURL(
    //   'https://cdn.img.ly/assets/v6/ly.img.text.components/box/blocks.blocks'
    // );
    // console.log('Loaded blocks from URL:', loadedBlocks.length);

    // Loaded blocks must be parented to appear in the scene
    // For demo purposes, we won't add them to avoid duplicates
    for (const block of loadedBlocks) {
      engine.block.destroy(block);
    }

    // Clean up subscriptions when done
    // In a real application, you'd keep these active as needed
    unsubscribeSelection();
    unsubscribeState();

    console.log('Blocks guide initialized successfully.');
    console.log('Created graphic block with image fill and text block.');
    console.log(
      'Demonstrated: types, hierarchy, properties, selection, state, and serialization.'
    );
  }
}

export default Example;
