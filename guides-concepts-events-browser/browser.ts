import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Events Guide
 *
 * Demonstrates working with block lifecycle events in CE.SDK:
 * - Subscribing to all block events
 * - Filtering events to specific blocks
 * - Processing Created, Updated, and Destroyed event types
 * - Event batching and deduplication behavior
 * - Safe handling of destroyed blocks
 * - Proper unsubscription for cleanup
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
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Subscribe to events from all blocks in the scene
    // Pass an empty array to receive events from every block
    const unsubscribeAll = engine.event.subscribe([], (events) => {
      for (const event of events) {
        console.log(
          `[All Blocks] ${event.type} event for block ${event.block}`
        );
      }
    });

    // Get the current page to add blocks to
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Create a graphic block - this triggers a Created event
    const graphic = engine.block.create('graphic');

    // Set up the graphic with a shape and fill
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(graphic, rectShape);

    // Position and size the graphic
    engine.block.setPositionX(graphic, 200);
    engine.block.setPositionY(graphic, 150);
    engine.block.setWidth(graphic, 400);
    engine.block.setHeight(graphic, 300);

    // Add an image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(graphic, imageFill);
    engine.block.setEnum(graphic, 'contentFill/mode', 'Cover');

    // Append to page to make it visible
    engine.block.appendChild(page, graphic);
    console.log('Created graphic block:', graphic);

    // Subscribe to events for specific blocks only
    // This is more efficient when you only care about certain blocks
    const unsubscribeSpecific = engine.event.subscribe([graphic], (events) => {
      for (const event of events) {
        console.log(
          `[Specific Block] ${event.type} event for block ${event.block}`
        );
      }
    });

    // Modify the block - this triggers Updated events
    // Due to deduplication, multiple rapid changes result in one Updated event
    engine.block.setRotation(graphic, 0.1); // Rotate slightly
    engine.block.setFloat(graphic, 'opacity', 0.9); // Adjust opacity
    console.log('Modified graphic block - rotation and opacity changed');

    // Process events by checking the type property
    const unsubscribeProcess = engine.event.subscribe([], (events) => {
      for (const event of events) {
        switch (event.type) {
          case 'Created': {
            // Block was just created - safe to use Block API
            const blockType = engine.block.getType(event.block);
            console.log(`Block created with type: ${blockType}`);
            break;
          }
          case 'Updated': {
            // Block property changed - safe to use Block API
            console.log(`Block ${event.block} was updated`);
            break;
          }
          case 'Destroyed': {
            // Block was destroyed - must check validity before using Block API
            const isValid = engine.block.isValid(event.block);
            console.log(
              `Block ${event.block} destroyed, still valid: ${isValid}`
            );
            break;
          }
        }
      }
    });

    // When handling Destroyed events, always check block validity
    // The block ID is no longer valid after destruction
    const unsubscribeDestroyed = engine.event.subscribe([], (events) => {
      for (const event of events) {
        if (event.type === 'Destroyed') {
          // IMPORTANT: Check validity before any Block API calls
          if (engine.block.isValid(event.block)) {
            // Block is still valid (this shouldn't happen for Destroyed events)
            console.log('Block is unexpectedly still valid');
          } else {
            // Block is invalid - expected for Destroyed events
            // Clean up any references to this block ID
            console.log(
              `Block ${event.block} has been destroyed and is invalid`
            );
          }
        }
      }
    });

    // Create a second block to demonstrate destruction
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);
    engine.block.setPositionX(textBlock, 200);
    engine.block.setPositionY(textBlock, 500);
    engine.block.setWidth(textBlock, 400);
    engine.block.setHeight(textBlock, 50);
    engine.block.setString(textBlock, 'text/text', 'Events Demo');
    engine.block.setFloat(textBlock, 'text/fontSize', 48);
    console.log('Created text block:', textBlock);

    // Destroy the text block - this triggers a Destroyed event
    engine.block.destroy(textBlock);
    console.log('Destroyed text block');

    // After destruction, the block ID is no longer valid
    const isTextBlockValid = engine.block.isValid(textBlock);
    console.log('Text block still valid after destroy:', isTextBlockValid); // false

    // Clean up subscriptions when no longer needed
    // This prevents memory leaks and reduces engine overhead
    unsubscribeAll();
    unsubscribeSpecific();
    unsubscribeProcess();
    unsubscribeDestroyed();
    console.log('Unsubscribed from all event listeners');

    // Re-subscribe with a single listener for the demo UI
    engine.event.subscribe([], (events) => {
      for (const event of events) {
        console.log(`Event: ${event.type} - Block: ${event.block}`);
      }
    });

    console.log('Events guide initialized successfully.');
    console.log(
      'Demonstrated: subscribing, event types, processing, and cleanup.'
    );
  }
}

export default Example;
