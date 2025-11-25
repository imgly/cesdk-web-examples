import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { ProductConfig, ProductColor } from './ProductEditorUIConfig';

let isConfiguratorActive = false;

/**
 * Enables product configurator mode by creating a temporary scene with the mockup image
 * and a visual rectangle overlay representing the printable area.
 *
 * The user can move and resize the rectangle, and the configuration (pageSize and printableAreaPx)
 * is logged to the console after each change.
 *
 * @param instance - The CreativeEditorSDK instance
 * @param product - The current product configuration
 * @param areaId - The current area ID (e.g., 'front', 'back')
 * @param color - The current color
 */
export async function enableProductConfigurator(
  instance: CreativeEditorSDK,
  product: ProductConfig,
  areaId: string,
  color: ProductColor
): Promise<void> {
  if (isConfiguratorActive) {
    console.warn('⚠️ Configurator already active. Call window.__cleanupProductConfigurator() first.');
    return;
  }
  isConfiguratorActive = true;

  const engine = instance.engine;

  console.log('🎨 Product Configurator Mode Enabled');
  console.log(`Product: ${product.label}, Area: ${areaId}, Color: ${color.id}`);

  // Get area configuration
  const area = product.areas.find((a) => a.id === areaId);
  if (!area || !area.mockup) {
    console.error(`No mockup configuration found for area: ${areaId}`);
    isConfiguratorActive = false;
    return;
  }

  // Save current editing scene
  console.log('💾 Saving current editing scene...');
  const savedEditingScene = await engine.scene.saveToString();

  // Create temporary configurator scene
  console.log('🔨 Creating configurator scene...');
  const scene = engine.scene.create('Free');

  // Use Pixel design unit for 1:1 coordinate mapping
  engine.scene.setDesignUnit('Pixel');

  // Hide page title
  engine.editor.setSetting('page/title/show', false);

  // Create page for the configurator
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page size to match mockup image dimensions
  const imageWidth = area.mockup.images?.[0]?.width ?? 0;
  const imageHeight = area.mockup.images?.[0]?.height ?? 0;

  engine.block.setWidth(page, imageWidth);
  engine.block.setHeight(page, imageHeight);

  // Make page background transparent
  const pageFill = engine.block.createFill('color');
  engine.block.setColor(pageFill, 'fill/color/value', { r: 0, g: 0, b: 0, a: 0 });
  engine.block.setFill(page, pageFill);

  // Disable page selection
  engine.block.setScopeEnabled(page, 'editor/select', false);

  // Add mockup image as background
  const mockupBlock = engine.block.create('graphic');
  const mockupShape = engine.block.createShape('rect');
  engine.block.setShape(mockupBlock, mockupShape);

  // Set image fill
  const mockupFill = engine.block.createFill('image');
  const mockupUri = area.mockup.images![0].uri.replace('{{color}}', color.id);
  engine.block.setString(mockupFill, 'fill/image/imageFileURI', mockupUri);
  engine.block.setFill(mockupBlock, mockupFill);

  // Size and position mockup image
  engine.block.setWidth(mockupBlock, imageWidth);
  engine.block.setHeight(mockupBlock, imageHeight);
  engine.block.setPositionX(mockupBlock, 0);
  engine.block.setPositionY(mockupBlock, 0);

  // Disable selection and movement of mockup
  engine.block.setScopeEnabled(mockupBlock, 'editor/select', false);

  // Add mockup to page as first child (background)
  engine.block.insertChild(page, mockupBlock, 0);

  // Create visual rectangle for printable area
  const rectBlock = engine.block.create('graphic');
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(rectBlock, rectShape);

  // Position and size based on current printableAreaPx configuration
  const printableArea = area.mockup.printableAreaPx;
  engine.block.setPositionX(rectBlock, printableArea.x);
  engine.block.setPositionY(rectBlock, printableArea.y);
  engine.block.setWidth(rectBlock, printableArea.width);
  engine.block.setHeight(rectBlock, printableArea.height);

  // Visual styling - semi-transparent blue fill with bright stroke
  const rectFill = engine.block.createFill('color');
  engine.block.setColor(rectFill, 'fill/color/value', {
    r: 0,
    g: 0.5,
    b: 1,
    a: 0.2 // 20% opacity
  });
  engine.block.setFill(rectBlock, rectFill);

  // Bright blue border for visibility
  engine.block.setStrokeEnabled(rectBlock, true);
  engine.block.setStrokeStyle(rectBlock, 'Solid');
  engine.block.setStrokeWidth(rectBlock, 3);
  engine.block.setStrokeColor(rectBlock, {
    r: 0,
    g: 0.5,
    b: 1,
    a: 1
  });

  // Enable selection, move, and resize
  engine.block.setScopeEnabled(rectBlock, 'editor/select', true);
  engine.block.setScopeEnabled(rectBlock, 'layer/move', true);
  engine.block.setScopeEnabled(rectBlock, 'layer/resize', true);

  // Disable rotation for simpler UX
  engine.block.setScopeEnabled(rectBlock, 'layer/rotate', false);

  // Add rectangle to page
  engine.block.appendChild(page, rectBlock);

  // Select the rectangle
  engine.block.setSelected(rectBlock, true);

  console.log('📐 Mockup dimensions:', { width: imageWidth, height: imageHeight });
  console.log('📄 Product page size:', area.pageSize);

  // Function to calculate and log configuration
  const logConfiguration = () => {
    // Get rectangle position and size (in pixels)
    const x = engine.block.getPositionX(rectBlock);
    const y = engine.block.getPositionY(rectBlock);
    const width = engine.block.getWidth(rectBlock);
    const height = engine.block.getHeight(rectBlock);

    // Since we're using Pixel design unit, coordinates are direct pixel values
    const printableAreaPx = {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      width: Math.round(width * 100) / 100,
      height: Math.round(height * 100) / 100
    };

    // Calculate pageSize in the product's design unit
    // Scale based on how the printable area size changed
    const widthRatio = width / printableArea.width;
    const heightRatio = height / printableArea.height;
    const pageWidth = Math.round(area.pageSize.width * widthRatio * 100) / 100;
    const pageHeight = Math.round(area.pageSize.height * heightRatio * 100) / 100;

    console.log('\n✅ Copy this to product.ts:\n');
    console.log('pageSize:', {
      width: pageWidth,
      height: pageHeight
    });
    console.log('printableAreaPx:', printableAreaPx);
    console.log('');
  };

  // Subscribe to history changes to detect when user stops dragging/resizing
  const unsubscribe = engine.editor.onHistoryUpdated(() => {
    logConfiguration();
  });

  // Log initial state
  console.log('🎯 Move or resize the blue rectangle to adjust the printable area.');
  console.log('📝 Configuration will be logged after each change.');
  logConfiguration();

  // Cleanup function to restore original scene
  const cleanup = async () => {
    unsubscribe();
    console.log('🔄 Restoring editing scene...');
    await engine.scene.loadFromString(savedEditingScene, true);
    isConfiguratorActive = false;
    console.log('🧹 Product Configurator cleaned up, editing scene restored');
  };

  // Store cleanup function for manual cleanup
  (window as any).__cleanupProductConfigurator = cleanup;

  console.log('💡 To exit configurator: window.__cleanupProductConfigurator()');
}
