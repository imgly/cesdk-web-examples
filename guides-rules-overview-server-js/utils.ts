export interface GridConfig {
  spacing?: number;
  margin?: number;
  labelHeight?: number;
}

export interface GridLayout {
  blockWidth: number;
  blockHeight: number;
  labelHeight: number;
  getBlockPosition: (index: number) => { x: number; y: number };
  getLabelPosition: (index: number) => { x: number; y: number };
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  spacing: 50,
  margin: 60,
  labelHeight: 100,
};

/**
 * Calculate grid layout for a 3+2 centered pyramid layout with labels.
 * Top row has 3 blocks, bottom row has 2 blocks centered below.
 *
 * @param pageWidth - Available page width
 * @param pageHeight - Available page height
 * @param config - Grid configuration (spacing, margin, labelHeight)
 * @returns Grid layout with block/label dimensions and position calculators
 */
export function calculatePyramidLayout(
  pageWidth: number,
  pageHeight: number,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  const spacing = config.spacing ?? DEFAULT_GRID_CONFIG.spacing!;
  const margin = config.margin ?? DEFAULT_GRID_CONFIG.margin!;
  const labelHeight = config.labelHeight ?? DEFAULT_GRID_CONFIG.labelHeight!;

  const cols = 3;
  const rows = 2;
  const labelGap = 8;

  // Calculate block dimensions
  const blockWidth = (pageWidth - 2 * margin - (cols - 1) * spacing) / cols;
  const blockHeight =
    (pageHeight - 2 * margin - spacing - rows * (labelHeight + labelGap)) /
    rows;

  // Calculate total grid dimensions
  const topRowWidth = cols * blockWidth + (cols - 1) * spacing;
  const bottomRowWidth = 2 * blockWidth + spacing;
  const totalHeight =
    rows * blockHeight + (rows - 1) * spacing + rows * (labelHeight + labelGap);

  // Calculate starting positions (centered on page)
  const topRowStartX = (pageWidth - topRowWidth) / 2;
  const bottomRowStartX = (pageWidth - bottomRowWidth) / 2;
  const startY = (pageHeight - totalHeight) / 2;

  const rowHeight = blockHeight + labelHeight + labelGap + spacing;

  const getBlockPosition = (index: number) => {
    if (index < 3) {
      // Top row (3 blocks)
      return {
        x: topRowStartX + index * (blockWidth + spacing),
        y: startY,
      };
    } else {
      // Bottom row (2 blocks, centered)
      const bottomIndex = index - 3;
      return {
        x: bottomRowStartX + bottomIndex * (blockWidth + spacing),
        y: startY + rowHeight,
      };
    }
  };

  const getLabelPosition = (index: number) => {
    const blockPos = getBlockPosition(index);
    return {
      x: blockPos.x,
      y: blockPos.y + blockHeight + labelGap,
    };
  };

  return {
    blockWidth,
    blockHeight,
    labelHeight,
    getBlockPosition,
    getLabelPosition,
  };
}
