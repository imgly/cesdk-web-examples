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
  left: 5,
  top: 50,
  right: 5,
  bottom: 60
};

/**
 * Exports the design, including an archive for resuming work, PDFs for printing, and thumbnails for UI previews.
 * @param engine - The CreativeEngine instance.
 * @returns An object containing the archive, PDFs, and thumbnails.
 */
export async function exportDesigns(instance: CreativeEditorSDK) {
  const engine = instance.engine;
  const archive = await engine.scene.saveToArchive();
  // Retrieves all page blocks in the scene (each page represents a product area)
  const pages = engine.block.findByType('page');
  const pdfs: { [areaId: string]: Blob } = {};
  const thumbnails: { [areaId: string]: Blob } = {};
  const previews: { [areaId: string]: Blob } = {};

  // Retrieve the current color ID from the visible mockup image block
  const currentVisibleMockupBlock = engine.block
    .findByKind(MOCKUP_IMAGE_BLOCK_KIND)
    .find((block) => engine.block.isVisible(block));
  const colorId = currentVisibleMockupBlock
    ? engine.block.getName(currentVisibleMockupBlock).split('-')[2]
    : 'white';

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const areaId = engine.block.getName(page);
    const mockupImageBlock = engine.block.findByName(
      `Mockup-${areaId}-${colorId}`
    )[0];
    const mockupVisible = engine.block.isVisible(mockupImageBlock);
    if (!mockupVisible) {
      engine.block.setVisible(mockupImageBlock, true);
      if (currentVisibleMockupBlock) {
        engine.block.setVisible(currentVisibleMockupBlock, false);
      }
    }
    if (!page) {
      throw new Error('No current page found');
    }
    // Disable strokes for the pdf export
    engine.block.setStrokeEnabled(page, false);
    const pdf = await engine.block.export(page, {
      mimeType: 'application/pdf'
    });
    pdfs[areaId] = pdf;
    const thumbnail = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: EXPORT_THUMBNAIL_SIZE.width,
      targetHeight: EXPORT_THUMBNAIL_SIZE.height
    });
    thumbnails[areaId] = thumbnail;
    if (!mockupVisible) {
      await instance.unstable_switchPage(page);
    }
    const sceneBlock = engine.scene.get();
    if (sceneBlock !== null && sceneBlock >= 0) {
      const productData = getProductData(engine, sceneBlock);
      const imageConfig =
        productData?.areas.find(({ id }) => id == engine.block.getName(page))
          ?.mockup?.images ?? [];
      const preview = await engine.block.export(sceneBlock, {
        mimeType: 'image/png',
        targetWidth: imageConfig ? imageConfig[0].width : undefined,
        targetHeight: imageConfig ? imageConfig[0].height : undefined
      });
      previews[areaId] = preview;
      // Enable strokes again
      engine.block.setStrokeEnabled(page, true);
    }
    if (!mockupVisible) {
      if (currentVisibleMockupBlock) {
        engine.block.setVisible(currentVisibleMockupBlock, true);
      }
      engine.block.setVisible(mockupImageBlock, false);
      await instance.unstable_switchPage(pages[(i + 1) % pages.length]);
    }
  }

  return {
    archive,
    pdfs,
    thumbnails,
    previews
  };
}

/**
 * Switches the editor view to a specific product area (page) and updates the mockup image.
 * @param instance - The CreativeEditorSDK instance.
 * @param mockupArea - The configuration for the mockup area.
 * @param areaId - The ID of the product area to switch to.
 * @param color - The selected product color.
 */
export async function switchProductView(
  instance: CreativeEditorSDK,
  mockupArea: ProductAreaMockupConfig,
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
  // Let the editor rerender
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });

  const pageBlock = page[0];
  // Switches the editor view to the specified page block
  await instance.unstable_switchPage(pageBlock);

  const currentVisibleMockupBlock = engine.block
    .findByKind(MOCKUP_IMAGE_BLOCK_KIND)
    .find((block) => engine.block.isVisible(block));
  engine.block.setVisible(mockupImageBlock, true);
  if (currentVisibleMockupBlock) {
    engine.block.setVisible(currentVisibleMockupBlock, false);
  }
  // Set the zoom level to fit the entire mockup image within the view
  const sceneBlock = engine.scene.get()!;
  if (engine.block.hasMetadata(sceneBlock, 'zoomLevel')) {
    if (
      currentVisibleMockupBlock &&
      engine.block.getName(currentVisibleMockupBlock).split('-')[1] !== areaId
    ) {
      engine.scene.setZoomLevel(
        parseFloat(engine.block.getMetadata(sceneBlock, 'zoomLevel'))
      );
    }
  } else {
    // Sets the zoom level to fit the entire mockup image within the view.
    await engine.scene.zoomToBlock(
      mockupImageBlock,
      ZOOM_PADDING.left,
      ZOOM_PADDING.top,
      ZOOM_PADDING.right,
      ZOOM_PADDING.bottom
    );
    // Save zoom level for smooth transition to other options
    engine.block.setMetadata(
      sceneBlock,
      'zoomLevel',
      engine.scene.getZoomLevel().toString()
    );
  }
}

/**
 * Creates or updates the scene based on the provided product configuration.
 * It sets up pages for each product area and configures the design unit.
 * @param engine - The CreativeEngine instance.
 * @param product - The product configuration.
 */
export async function createOrUpdateSceneByProduct(
  engine: CreativeEngine,
  product: ProductConfig
) {
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
  if (engine.block.findByKind(MOCKUP_IMAGE_BLOCK_KIND).length === 0) {
    await createAllMockupImageBlocks(engine, product);
  }
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
 * @param engine - The CreativeEngine instance.
 * @param pageBlock - The ID of the page block to configure.
 * @param productArea - The product area configuration.
 */
function setupPageForArea(
  engine: CreativeEngine,
  pageBlock: number,
  productArea: ProductAreaConfig
) {
  // Set the size of the page block
  const width = productArea.pageSize.width;
  const height = productArea.pageSize.height;
  engine.block.setWidth(pageBlock, width);
  engine.block.setHeight(pageBlock, height);
  // Set the stroke width to .05 of the page size
  engine.block.setStrokeWidth(pageBlock, PAGE_STROKE_WIDTH_RATIO * width);
  // Set the name of the page block to the product area ID
  engine.block.setName(pageBlock, productArea.id);
}

const MOCKUP_IMAGE_BLOCK_KIND = 'mockup_image';

/**
 * Sets up the mockup image block in the creative engine with the provided configuration.
 * This includes setting the image source, disabling selection, and positioning the image block in the scene.
 *
 * @param {CreativeEngine} engine - The creative engine instance.
 * @param {number} mockupImageBlock - The ID of the mockup image block.
 * @param {ProductAreaMockupConfig} mockup - The mockup configuration object containing image source and positioning information.
 */
function setMockupImageBlock(
  engine: CreativeEngine,
  mockupImageBlock: number,
  mockup: ProductAreaMockupConfig | undefined,
  color: ProductColor
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
  const currentPage = engine.scene.getCurrentPage();
  if (!currentPage) {
    throw new Error('No current page found');
  }
  const pageWidth = engine.block.getWidth(currentPage);
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
async function createMockupImageBlock(engine: CreativeEngine) {
  const sceneBlock = engine.scene.get()!;
  const mockupImageBlock = await engine.block.create('graphic');
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
 * Creates all mockup image blocks for the product areas and colors.
 * @param engine - The CreativeEngine instance.
 * @param product - The product configuration.
 * @returns
 */
function createAllMockupImageBlocks(
  engine: CreativeEngine,
  product: ProductConfig
) {
  const mockupImageBlocks: number[] = [];
  product.areas
    .filter((a) => !a.disabled)
    .forEach(({ id, mockup }) => {
      product.colors.forEach(async (color) => {
        const mockupImageBlock = await createMockupImageBlock(engine);
        engine.block.setName(mockupImageBlock, `Mockup-${id}-${color.id}`);
        await setMockupImageBlock(engine, mockupImageBlock, mockup, color);
        engine.block.setVisible(mockupImageBlock, false);
        mockupImageBlocks.push(mockupImageBlock);
      });
    });
  return mockupImageBlocks;
}

const PRODUCT_METADATA_KEY = 'product_metadata';

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
  if (!hasMetaData) return null;

  const productDataJSON = engine.block.getMetadata(
    sceneBlock,
    PRODUCT_METADATA_KEY
  );
  if (!productDataJSON) return null;

  try {
    const productData = JSON.parse(productDataJSON);
    return productData;
  } catch (error) {
    console.error('Failed to parse product data JSON', error);
  }

  return null;
}
