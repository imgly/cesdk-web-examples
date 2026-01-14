export interface GridConfig {
  spacing?: number;
  margin?: number;
}

export interface GridLayout {
  blockWidth: number;
  blockHeight: number;
  cols: number;
  rows: number;
  getPosition: (index: number) => { x: number; y: number };
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  spacing: 20,
  margin: 40
};

/**
 * Calculate optimal grid layout with square blocks based on number of items
 *
 * @param pageWidth - Available page width
 * @param pageHeight - Available page height
 * @param itemCount - Number of items to place in grid (optional, defaults to 9)
 * @param config - Grid configuration (spacing and margin)
 * @returns Grid layout with square blocks and position calculator
 */
export function calculateGridLayout(
  pageWidth: number,
  pageHeight: number,
  itemCount: number = 9,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  const spacing = config.spacing ?? DEFAULT_GRID_CONFIG.spacing!;
  const margin = config.margin ?? DEFAULT_GRID_CONFIG.margin!;

  // Calculate optimal grid dimensions
  const { cols, rows } = calculateOptimalGrid(
    pageWidth,
    pageHeight,
    itemCount,
    spacing,
    margin
  );

  // Calculate available space
  const availableWidth = pageWidth - 2 * margin - (cols - 1) * spacing;
  const availableHeight = pageHeight - 2 * margin - (rows - 1) * spacing;

  // Calculate potential block sizes
  const blockWidthFromWidth = availableWidth / cols;
  const blockHeightFromHeight = availableHeight / rows;

  // Use the smaller dimension to ensure square blocks that fit
  const blockSize = Math.min(blockWidthFromWidth, blockHeightFromHeight);
  const blockWidth = blockSize;
  const blockHeight = blockSize;

  // Calculate actual grid dimensions with square blocks
  const totalGridWidth = cols * blockSize + (cols - 1) * spacing;
  const totalGridHeight = rows * blockSize + (rows - 1) * spacing;

  // Center the grid on the page
  const startX = (pageWidth - totalGridWidth) / 2;
  const startY = (pageHeight - totalGridHeight) / 2;

  const getPosition = (index: number) => ({
    x: startX + (index % cols) * (blockSize + spacing),
    y: startY + Math.floor(index / cols) * (blockSize + spacing)
  });

  return { blockWidth, blockHeight, cols, rows, getPosition };
}

/**
 * Calculate optimal columns and rows for grid layout
 * Attempts to create a layout that:
 * - Minimizes empty space
 * - Prefers slightly wider than tall layouts
 * - Maximizes block size
 */
function calculateOptimalGrid(
  pageWidth: number,
  pageHeight: number,
  itemCount: number,
  spacing: number,
  margin: number
): { cols: number; rows: number } {
  // Start with square root as base
  const sqrt = Math.ceil(Math.sqrt(itemCount));

  // Calculate aspect ratio of page
  const pageAspectRatio = pageWidth / pageHeight;

  let bestCols = sqrt;
  let bestRows = sqrt;
  let bestScore = -Infinity;

  // Try different column/row combinations around the square root
  for (let cols = Math.max(1, sqrt - 2); cols <= sqrt + 2; cols++) {
    const rows = Math.ceil(itemCount / cols);

    // Skip if this doesn't fit all items
    if (cols * rows < itemCount) continue;

    // Calculate what block size we'd get with this layout
    const availableWidth = pageWidth - 2 * margin - (cols - 1) * spacing;
    const availableHeight = pageHeight - 2 * margin - (rows - 1) * spacing;
    const blockWidthFromWidth = availableWidth / cols;
    const blockHeightFromHeight = availableHeight / rows;
    const blockSize = Math.min(blockWidthFromWidth, blockHeightFromHeight);

    // Calculate how well this layout uses the available space
    const gridAspectRatio = cols / rows;
    const aspectRatioDiff = Math.abs(gridAspectRatio - pageAspectRatio);
    const emptySlots = cols * rows - itemCount;

    // Score based on:
    // - Larger block size (most important)
    // - Fewer empty slots
    // - Better aspect ratio match
    const score =
      blockSize * 1000 - // Prioritize larger blocks
      emptySlots * 10 - // Penalize empty slots
      aspectRatioDiff * 5; // Penalize aspect ratio mismatch

    if (score > bestScore) {
      bestScore = score;
      bestCols = cols;
      bestRows = rows;
    }
  }

  return { cols: bestCols, rows: bestRows };
}
