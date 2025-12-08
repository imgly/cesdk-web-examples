import CreativeEditorSDK, {
  CreativeEngine,
  DesignUnit,
  Source
} from '@cesdk/cesdk-js';

export interface ProductConfig {
  id: string;
  label: string;
  designUnit: DesignUnit; // Defines the unit of measurement for the design (e.g., pixels, millimeters)
  unitPrice: number;
  areas: ProductAreaConfig[];
  colors: ProductColor[];
  sizes: ProductSize[];
}

export interface ProductAreaConfig {
  id: string;
  label: string;
  pageSize: {
    width: number;
    height: number;
  };
  // Optional property for visible but disabled options
  disabled?: boolean;
  mockup?: ProductAreaMockupConfig; // Optional configuration for the mockup image associated with this area
}

interface ProductAreaMockupConfig {
  images?: Source[]; // Source set URLs for the mockup image
  printableAreaPx: {
    // Coordinates and dimensions of the printable area within the mockup image in pixels
    x: number;
    y: number;
    width: number;
    height: number;
  };
  editingMaskUrl?: string; // Optional PNG mask shown during editing (e.g., gray overlay for visual clarity)
  exportingMaskUrl?: string; // Optional PNG mask shown during export (e.g., white overlay)
}

export interface ProductColor {
  id: string;
  label?: string;
  colorHex: string;
  isDefault?: boolean;
}

export interface ProductSize {
  id: string;
  label?: string;
  value?: string;
}

const EXPORT_THUMBNAIL_SIZE = {
  width: 200,
  height: 200
};
const PAGE_STROKE_COLOR = {
  r: 0,
  g: 0,
  b: 0,
  a: 1
};
const PAGE_STROKE_WIDTH_RATIO = 0.005;
const ZOOM_PADDING = {
  left: 40,
  top: 80,
  right: 40,
  bottom: 100
};

/**
 * Exports the design, including an archive for resuming work, PDFs for printing, and thumbnails for UI previews.
 * @param instance - The CreativeEditorSDK instance.
 * @param product - The product configuration.
 * @returns An object containing the archive, PDFs, and thumbnails.
 */
export async function exportDesigns(
  instance: CreativeEditorSDK,
  product: ProductConfig
) {
  const engine = instance.engine;
  const archive = await engine.scene.saveToArchive();
  const pages = engine.block.findByType('page');
  const pdfs: { [areaId: string]: Blob } = {};
  const thumbnails: { [areaId: string]: Blob } = {};

  // Export PDFs and thumbnails with exporting masks (clean export without sign holders)
  await updateMaskBlocksForProduct(engine, product, 'exporting');

  for (const page of pages) {
    const areaId = engine.block.getName(page);
    engine.block.setStrokeEnabled(page, false);

    pdfs[areaId] = await engine.block.export(page, {
      mimeType: 'application/pdf'
    });
    thumbnails[areaId] = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: EXPORT_THUMBNAIL_SIZE.width,
      targetHeight: EXPORT_THUMBNAIL_SIZE.height
    });

    engine.block.setStrokeEnabled(page, true);
  }

  // Restore editing masks after export
  await updateMaskBlocksForProduct(engine, product, 'editing');

  return {
    archive,
    pdfs,
    thumbnails
  };
}

/**
 * Switches the editor view to a specific product area (page) and updates the mockup image.
 * @param instance - The CreativeEditorSDK instance.
 * @param areaId - The ID of the product area to switch to.
 * @param color - The selected product color.
 */
export async function switchProductView(
  instance: CreativeEditorSDK,
  areaId: string,
  color: ProductColor
) {
  const engine = instance.engine;
  // Deselect all
  instance.engine.block.findAllSelected().forEach((block) => {
    instance.engine.block.setSelected(block, false);
  });
  // Finds the page block corresponding to the given area ID
  const page = instance.engine.block.findByName(areaId);

  if (page.length !== 1) {
    throw new Error(`Found ${page.length} pages with the name ${areaId}`);
  }

  const mockupImageBlock = engine.block.findByName(
    `Mockup-${areaId}-${color.id}`
  )[0];

  const pageBlock = page[0];
  // Switches the editor view to the specified page block
  await instance.unstable_switchPage(pageBlock);

  const currentVisibleMockupBlock = engine.block
    .findByKind(MOCKUP_IMAGE_BLOCK_KIND)
    .find((block) => engine.block.isVisible(block));

  // Hide currently visible mockup (only if it's a different block and still valid)
  if (
    currentVisibleMockupBlock &&
    currentVisibleMockupBlock !== mockupImageBlock
  ) {
    try {
      engine.block.setVisible(currentVisibleMockupBlock, false);
    } catch {
      // Block may have been destroyed during product switch, ignore
    }
  }

  // Show the new mockup
  if (mockupImageBlock) {
    engine.block.setVisible(mockupImageBlock, true);
  }

  // Always zoom to fit the mockup image within the view
  // Using zoom.toBlock action with autoFit enables automatic zoom adjustment when viewport resizes
  await instance.actions.run('zoom.toBlock', mockupImageBlock, {
    padding: ZOOM_PADDING,
    animate: false,
    autoFit: true
  });
}

/**
 * Creates or updates the scene based on the provided product configuration.
 * It sets up pages for each product area and configures the design unit.
 * @param engine - The CreativeEngine instance.
 * @param product - The product configuration.
 * @returns true if the scene was successfully created/updated, false otherwise.
 */
export async function createOrUpdateSceneByProduct(
  engine: CreativeEngine,
  product: ProductConfig
): Promise<boolean> {
  // Guard: Ensure scene module is available
  if (!engine.scene) {
    console.warn('Engine scene module not yet initialized');
    return false;
  }
  // Check if we have a scene or create it
  const scene = engine.scene.get() ?? engine.scene.create('Free');
  // Disables dimming of out-of-page areas in the editor
  engine.editor.setSettingBool('page/dimOutOfPageAreas', false);

  // Sets the design unit for the scene
  const designUnit = product.designUnit;
  engine.scene.setDesignUnit(designUnit);
  // Save the product as custom metadata, so we can access it later if needed
  setProductData(engine, scene, product);

  // Create pages for each area
  const usedPageBlocks: number[] = product.areas
    .filter(({ disabled }) => !disabled)
    .map((area) => {
      const pageBlocks = engine.block.findByName(area.id);
      let pageBlock: number;

      if (pageBlocks.length > 1) {
        throw new Error(
          `Found multiple page blocks with the name ${area.label}`
        );
      } else if (pageBlocks.length === 0) {
        pageBlock = createPage(engine);
      } else {
        pageBlock = pageBlocks[0];
      }

      setupPageForArea(engine, pageBlock, area);

      return pageBlock;
    });
  // Remove unused page blocks
  const allPageBlocks = engine.block.findByType('page');
  allPageBlocks
    .filter((pageBlock) => !usedPageBlocks.includes(pageBlock))
    .forEach((pageBlock) => {
      engine.block.destroy(pageBlock);
    });
  // Update mockup blocks only if product has changed
  await updateMockupBlocksForProduct(engine, product, scene);
  // Update mask blocks for areas with mask configurations
  await updateMaskBlocksForProduct(engine, product);
  return true;
}

/**
 * Creates a new page block in the scene.
 * @param engine - The CreativeEngine instance.
 * @returns The ID of the created page block.
 */
function createPage(engine: CreativeEngine) {
  const pageBlock = engine.block.create('page');
  const sceneBlock = engine.scene.get()!;
  engine.block.appendChild(sceneBlock, pageBlock);
  // Sets the page background to transparent
  const fill = engine.block.getFill(pageBlock);
  engine.block.setFill(pageBlock, fill);
  engine.block.setColor(fill, 'fill/color/value', { r: 0, g: 0, b: 0, a: 0 });
  // Add a page stroke to indicate the page area
  engine.block.setStrokeColor(pageBlock, PAGE_STROKE_COLOR);
  engine.block.setStrokeEnabled(pageBlock, true);
  engine.block.setStrokeStyle(pageBlock, 'Solid');
  // Disables selection of the page in the editor.
  engine.block.setScopeEnabled(pageBlock, 'editor/select', false);
  // Sets the page block to be clipped, preventing content from overflowing.
  engine.block.setClipped(pageBlock, true);

  return pageBlock;
}

/**
 * Configures the page block for a specific product area, setting its dimensions and name.
 * Only updates properties if they have changed to avoid unnecessary engine operations.
 * Uses resizeContentAware to automatically scale all content proportionally.
 * @param engine - The CreativeEngine instance.
 * @param pageBlock - The ID of the page block to configure.
 * @param productArea - The product area configuration.
 */
function setupPageForArea(
  engine: CreativeEngine,
  pageBlock: number,
  productArea: ProductAreaConfig
) {
  const width = productArea.pageSize.width;
  const height = productArea.pageSize.height;
  const strokeWidth = PAGE_STROKE_WIDTH_RATIO * width;

  // Check if this area has masks (editing or exporting mask URLs)
  const hasMasks =
    !!productArea.mockup?.editingMaskUrl ||
    !!productArea.mockup?.exportingMaskUrl;

  // Only update dimensions if they've changed
  const currentWidth = engine.block.getWidth(pageBlock);
  const currentHeight = engine.block.getHeight(pageBlock);
  if (currentWidth !== width || currentHeight !== height) {
    // Always use content-aware resizing to automatically scale all content
    engine.block.resizeContentAware([pageBlock], width, height);
  }

  // Only update stroke width if it's changed
  const currentStrokeWidth = engine.block.getStrokeWidth(pageBlock);
  if (currentStrokeWidth !== strokeWidth) {
    engine.block.setStrokeWidth(pageBlock, strokeWidth);
  }

  // Disable stroke if masks are present, otherwise enable it
  const shouldEnableStroke = !hasMasks;
  engine.block.setStrokeEnabled(pageBlock, shouldEnableStroke);

  // Only update name if it's changed
  const currentName = engine.block.getName(pageBlock);
  if (currentName !== productArea.id) {
    engine.block.setName(pageBlock, productArea.id);
  }
}

const MOCKUP_IMAGE_BLOCK_KIND = 'mockup_image';
const MASK_IMAGE_BLOCK_KIND = 'mask_image';

/**
 * Sets up the mockup image block in the creative engine with the provided configuration.
 * This includes setting the image source, disabling selection, and positioning the image block in the scene.
 *
 * @param {CreativeEngine} engine - The creative engine instance.
 * @param {number} mockupImageBlock - The ID of the mockup image block.
 * @param {ProductAreaMockupConfig} mockup - The mockup configuration object containing image source and positioning information.
 * @param {ProductColor} color - The color for the mockup.
 * @param {number} pageBlock - The page block ID for calculating design unit conversion.
 */
function setMockupImageBlock(
  engine: CreativeEngine,
  mockupImageBlock: number,
  mockup: ProductAreaMockupConfig | undefined,
  color: ProductColor,
  pageBlock: number
) {
  if (!mockup) {
    throw new Error('Mockup configuration is undefined');
  }
  const imageSource = mockup.images ?? [];
  if (imageSource.length === 0) {
    return;
  }

  // Update the image URIs by replacing them with the selected color ID.
  const updatedImageSource = imageSource.map((image) => {
    return {
      ...image,
      uri: image.uri.replace('{{color}}', color.id)
    };
  });
  const fill = engine.block.getFill(mockupImageBlock)!;
  // Sets the image source for the mockup image block as source set.
  engine.block.setSourceSet(fill, 'fill/image/sourceSet', updatedImageSource);

  // Disables selection of the mockup image block in the editor.
  engine.block.setScopeEnabled(mockupImageBlock, 'editor/select', false);

  const firstImageSource = imageSource[0];
  const imageHeight = firstImageSource.height;
  const imageWidth = firstImageSource.width;
  const xPx = mockup.printableAreaPx.x;
  const yPx = mockup.printableAreaPx.y;
  const widthPx = mockup.printableAreaPx.width;
  const pageWidth = engine.block.getWidth(pageBlock);
  const pxToDesignUnit = pageWidth / widthPx; // px / design unit

  const xDesignUnit = xPx * pxToDesignUnit;
  const yDesignUnit = yPx * pxToDesignUnit;
  const widthDesignUnit = imageWidth * pxToDesignUnit;
  const heightDesignUnit = imageHeight * pxToDesignUnit;
  // Position the image block in the scene
  engine.block.setWidth(mockupImageBlock, widthDesignUnit);
  engine.block.setHeight(mockupImageBlock, heightDesignUnit);
  engine.block.setPositionX(mockupImageBlock, -xDesignUnit);
  engine.block.setPositionY(mockupImageBlock, -yDesignUnit);
  // Reset any cropping applied to the mockup image block.
  engine.block.resetCrop(mockupImageBlock);
}

/**
 * Creates a new image block for the mockup.
 * @param engine - The CreativeEngine instance.
 * @returns The ID of the created mockup image block.
 */
function createMockupImageBlock(engine: CreativeEngine) {
  const sceneBlock = engine.scene.get()!;
  const mockupImageBlock = engine.block.create('graphic');
  engine.block.setKind(mockupImageBlock, MOCKUP_IMAGE_BLOCK_KIND);
  const shape = engine.block.createShape('rect');
  engine.block.setShape(mockupImageBlock, shape);
  const fill = engine.block.createFill('image');
  engine.block.setFill(mockupImageBlock, fill);
  // Inserts the mockup image block as the first child of the scene, ensuring it's behind other elements.
  engine.block.insertChild(sceneBlock, mockupImageBlock, 0);

  return mockupImageBlock;
}

/**
 * Creates a new mask image block for a page to indicate non-printable areas.
 * The mask is sized and positioned to match the mockup image dimensions.
 * @param engine - The CreativeEngine instance.
 * @param pageBlock - The ID of the page block to add the mask to.
 * @param maskImageUrl - The URL of the mask image (PNG with transparency).
 * @param mockup - The mockup configuration to determine mask sizing.
 * @param areaId - The area ID for naming the mask block.
 * @param maskType - Type of mask ('editing' or 'exporting').
 * @returns The ID of the created mask image block.
 */
async function createMaskImageBlock(
  engine: CreativeEngine,
  pageBlock: number,
  maskImageUrl: string,
  mockup: ProductAreaMockupConfig,
  areaId: string,
  maskType: 'editing' | 'exporting'
): Promise<number> {
  // Get page dimensions and mockup configuration
  const pageWidth = engine.block.getWidth(pageBlock);
  const imageSource = mockup.images ?? [];
  if (imageSource.length === 0) {
    throw new Error('Mockup configuration must include images');
  }

  const firstImageSource = imageSource[0];
  const imageHeight = firstImageSource.height;
  const imageWidth = firstImageSource.width;
  const xPx = mockup.printableAreaPx.x;
  const yPx = mockup.printableAreaPx.y;
  const widthPx = mockup.printableAreaPx.width;
  const pxToDesignUnit = pageWidth / widthPx; // Scale factor (same as mockup)

  // Calculate mask dimensions in design units (same as mockup)
  const maskWidthDesignUnit = imageWidth * pxToDesignUnit;
  const maskHeightDesignUnit = imageHeight * pxToDesignUnit;
  const xDesignUnit = xPx * pxToDesignUnit;
  const yDesignUnit = yPx * pxToDesignUnit;

  // Create graphic block for mask
  const maskImageBlock = engine.block.create('graphic');
  engine.block.setKind(maskImageBlock, MASK_IMAGE_BLOCK_KIND);
  engine.block.setName(maskImageBlock, `Mask-${maskType}-${areaId}`);

  // Create shape and fill
  const shape = engine.block.createShape('rect');
  engine.block.setShape(maskImageBlock, shape);

  const fill = engine.block.createFill('image');
  engine.block.setString(fill, 'fill/image/imageFileURI', maskImageUrl);
  engine.block.setFill(maskImageBlock, fill);

  // Set dimensions to match mockup in design units
  engine.block.setWidth(maskImageBlock, maskWidthDesignUnit);
  engine.block.setHeight(maskImageBlock, maskHeightDesignUnit);

  // Position mask to align with mockup
  // The mockup is positioned at (-xDesignUnit, -yDesignUnit) relative to the scene
  // to align its printable area with the page. Since the mask is a child of the page
  // and should overlay the mockup exactly, use the same offset.
  engine.block.setPositionX(maskImageBlock, -xDesignUnit);
  engine.block.setPositionY(maskImageBlock, -yDesignUnit);

  // Append as last child of page (topmost layer)
  engine.block.appendChild(pageBlock, maskImageBlock);

  // Make non-selectable, non-editable, and always visible
  engine.block.setScopeEnabled(maskImageBlock, 'editor/select', false);
  engine.editor.setSelectionEnabled(maskImageBlock, false);
  engine.block.setAlwaysOnTop(maskImageBlock, true);
  engine.block.setVisible(maskImageBlock, true);

  return maskImageBlock;
}

/**
 * Updates mask image blocks for product areas.
 * Replaces all existing masks with new ones based on the mask type (editing/exporting).
 * Only creates masks for areas that have the corresponding mask URL configured.
 */
async function updateMaskBlocksForProduct(
  engine: CreativeEngine,
  product: ProductConfig,
  maskType: 'editing' | 'exporting' = 'editing'
) {
  // Clear all existing masks
  engine.block
    .findByKind(MASK_IMAGE_BLOCK_KIND)
    .forEach((mask) => engine.block.destroy(mask));

  // Create masks for areas that have them configured
  for (const area of product.areas.filter((a) => !a.disabled)) {
    const maskUrl =
      maskType === 'editing'
        ? area.mockup?.editingMaskUrl
        : area.mockup?.exportingMaskUrl;

    if (!maskUrl || !area.mockup) continue;

    const [pageBlock] = engine.block.findByName(area.id);
    if (!pageBlock) continue;

    await createMaskImageBlock(
      engine,
      pageBlock,
      maskUrl,
      area.mockup,
      area.id,
      maskType
    );
  }
}

/**
 * Creates all mockup image blocks for the product areas and colors.
 * @param engine - The CreativeEngine instance.
 * @param product - The product configuration.
 * @returns
 */
async function createAllMockupImageBlocks(
  engine: CreativeEngine,
  product: ProductConfig
) {
  const mockupImageBlocks: number[] = [];
  const areas = product.areas.filter((a) => !a.disabled);

  for (const { id, mockup } of areas) {
    // Find the page block for this area
    const pageBlocks = engine.block.findByName(id);
    if (pageBlocks.length === 0) {
      throw new Error(`No page block found for area: ${id}`);
    }
    const pageBlock = pageBlocks[0];

    for (const color of product.colors) {
      const mockupImageBlock = createMockupImageBlock(engine);
      engine.block.setName(mockupImageBlock, `Mockup-${id}-${color.id}`);
      setMockupImageBlock(engine, mockupImageBlock, mockup, color, pageBlock);
      engine.block.setVisible(mockupImageBlock, false);
      mockupImageBlocks.push(mockupImageBlock);
    }
  }
  return mockupImageBlocks;
}

const PRODUCT_METADATA_KEY = 'product_metadata';
const CURRENT_PRODUCT_ID_KEY = 'current_product_id';

/**
 * Gets the current product ID from scene metadata.
 * @param engine - The CreativeEngine instance.
 * @param sceneBlock - The ID of the scene block.
 * @returns The current product ID or null if not set.
 */
function getCurrentProductId(
  engine: CreativeEngine,
  sceneBlock: number
): string | null {
  try {
    return engine.block.getMetadata(sceneBlock, CURRENT_PRODUCT_ID_KEY);
  } catch {
    return null;
  }
}

/**
 * Sets the current product ID in scene metadata.
 * @param engine - The CreativeEngine instance.
 * @param sceneBlock - The ID of the scene block.
 * @param productId - The product ID to store.
 */
function setCurrentProductId(
  engine: CreativeEngine,
  sceneBlock: number,
  productId: string
) {
  engine.block.setMetadata(sceneBlock, CURRENT_PRODUCT_ID_KEY, productId);
}

/**
 * Updates mockup blocks for a product, only recreating if product has changed.
 * This avoids expensive mockup recreation when just switching colors or areas.
 * @param engine - The CreativeEngine instance.
 * @param product - The product configuration.
 * @param sceneBlock - The scene block ID.
 */
async function updateMockupBlocksForProduct(
  engine: CreativeEngine,
  product: ProductConfig,
  sceneBlock: number
) {
  const currentProductId = getCurrentProductId(engine, sceneBlock);

  if (currentProductId !== product.id) {
    // Different product: destroy old mockups and create new ones
    const existingMockups = engine.block.findByKind(MOCKUP_IMAGE_BLOCK_KIND);
    existingMockups.forEach((block) => engine.block.destroy(block));
    await createAllMockupImageBlocks(engine, product);
    setCurrentProductId(engine, sceneBlock, product.id);
  }
  // Same product: reuse existing mockups (no action needed)
}

/**
 * Stores the product configuration as metadata in the scene, which can be accessed later if needed.
 * @param engine - The CreativeEngine instance.
 * @param sceneBlock - The ID of the scene block.
 * @param product - The product configuration to store.
 */
export function setProductData(
  engine: CreativeEngine,
  sceneBlock: number,
  product: ProductConfig
) {
  const productDataJSON = JSON.stringify(product);
  engine.block.setMetadata(sceneBlock, PRODUCT_METADATA_KEY, productDataJSON);
}

/**
 * Retrieves the product configuration from the scene's metadata.
 * @param engine - The CreativeEngine instance.
 * @param sceneBlock - The ID of the scene block.
 * @returns The product configuration, or null if not found or if parsing fails.
 */
export function getProductData(
  engine: CreativeEngine,
  sceneBlock: number
): ProductConfig | null {
  const hasMetaData = engine.block.hasMetadata(
    sceneBlock,
    PRODUCT_METADATA_KEY
  );

  if (!hasMetaData) {
    return null;
  }

  const productDataJSON = engine.block.getMetadata(
    sceneBlock,
    PRODUCT_METADATA_KEY
  );

  if (!productDataJSON) {
    return null;
  }

  try {
    const productData = JSON.parse(productDataJSON);
    return productData;
  } catch (error) {
    console.error('Failed to parse product data JSON', error);
  }

  return null;
}
