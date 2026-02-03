import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Editor State Guide
 *
 * Demonstrates working with editor state in CE.SDK:
 * - Understanding edit modes and switching between them
 * - Subscribing to state changes
 * - Reading cursor type and rotation
 * - Tracking text cursor position
 * - Detecting active interactions
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

    const engine = cesdk.engine;

    // Create a design scene with a page
    await cesdk.createDesignScene();
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Add an image block to demonstrate Crop mode
    const imageBlock = engine.block.create('graphic');
    engine.block.appendChild(page, imageBlock);

    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    engine.block.setWidth(imageBlock, 350);
    engine.block.setHeight(imageBlock, 250);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 175);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    // Add a text block to demonstrate Text mode
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    engine.block.replaceText(textBlock, 'Edit this text');
    engine.block.setTextFontSize(textBlock, 48);
    engine.block.setTextColor(textBlock, { r: 0.2, g: 0.2, b: 0.2, a: 1.0 });
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 450);
    engine.block.setPositionY(textBlock, 275);

    // Subscribe to state changes to track mode transitions
    // The returned function can be called to unsubscribe when no longer needed
    const unsubscribeFromStateChanges = engine.editor.onStateChanged(() => {
      const currentMode = engine.editor.getEditMode();
      console.log('Edit mode changed to:', currentMode);

      // Also log cursor state when state changes
      const cursorType = engine.editor.getCursorType();
      console.log('Current cursor type:', cursorType);
    });

    console.log('State change subscription active');

    // Example: Unsubscribe after a delay (in a real app, call when component unmounts)
    setTimeout(() => {
      unsubscribeFromStateChanges();
      console.log('Unsubscribed from state changes');
    }, 10000);

    // Get the current edit mode (default is Transform)
    const initialMode = engine.editor.getEditMode();
    console.log('Initial edit mode:', initialMode);

    // Select the image block and switch to Crop mode
    engine.block.select(imageBlock);
    engine.editor.setEditMode('Crop');
    console.log('Switched to Crop mode on image block');

    // After a moment, switch to Transform mode
    engine.editor.setEditMode('Transform');
    console.log('Switched back to Transform mode');

    // Create a custom edit mode that inherits from Crop behavior
    engine.editor.setEditMode('MyCustomCropMode', 'Crop');
    console.log(
      'Created custom mode based on Crop:',
      engine.editor.getEditMode()
    );

    // Switch back to Transform for the demo
    engine.editor.setEditMode('Transform');

    // Get the cursor type to display the appropriate mouse cursor
    const cursorType = engine.editor.getCursorType();
    console.log('Cursor type:', cursorType);
    // Returns: 'Arrow', 'Move', 'MoveNotPermitted', 'Resize', 'Rotate', or 'Text'

    // Get cursor rotation for directional cursors like resize handles
    const cursorRotation = engine.editor.getCursorRotation();
    console.log('Cursor rotation (radians):', cursorRotation);
    // Apply to cursor element: transform: rotate(${cursorRotation}rad)

    // Select the text block and switch to Text mode to get cursor position
    engine.block.select(textBlock);
    engine.editor.setEditMode('Text');

    // Get text cursor position in screen space
    const textCursorX = engine.editor.getTextCursorPositionInScreenSpaceX();
    const textCursorY = engine.editor.getTextCursorPositionInScreenSpaceY();
    console.log('Text cursor position:', { x: textCursorX, y: textCursorY });
    // Use these coordinates to position a floating toolbar near the text cursor

    // Check if a user interaction is currently in progress
    const isInteracting = engine.editor.unstable_isInteractionHappening();
    console.log('Is interaction happening:', isInteracting);
    // Use this to defer expensive operations during drag/resize operations
    if (!isInteracting) {
      console.log('Safe to perform heavy updates');
    }

    // Switch back to Transform mode and select the image for the hero screenshot
    engine.editor.setEditMode('Transform');
    engine.block.select(imageBlock);

    // Zoom to fit the page
    engine.scene.enableZoomAutoFit(page, 'Both');

    console.log('Editor State guide initialized successfully.');
    console.log('Try clicking on blocks to see edit modes change.');
    console.log('Double-click on the text block to enter Text mode.');
    console.log('Select the image and use the crop handle to enter Crop mode.');
  }
}

export default Example;
