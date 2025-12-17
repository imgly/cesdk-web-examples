export interface GridConfig {
  cols: number;
  rows: number;
  spacing: number;
  margin: number;
}

export interface GridLayout {
  blockWidth: number;
  blockHeight: number;
  getPosition: (index: number) => { x: number; y: number };
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
  cols: 3,
  rows: 3,
  spacing: 5,
  margin: 5
};

export function calculateGridLayout(
  pageWidth: number,
  pageHeight: number,
  itemCount: number,
  config: Partial<GridConfig> = {}
): GridLayout {
  const finalConfig = { ...DEFAULT_GRID_CONFIG, ...config };

  // Calculate optimal grid dimensions based on item count
  const cols = Math.ceil(Math.sqrt(itemCount));
  const rows = Math.ceil(itemCount / cols);

  const availableWidth =
    pageWidth - 2 * finalConfig.margin - (cols - 1) * finalConfig.spacing;
  const availableHeight =
    pageHeight - 2 * finalConfig.margin - (rows - 1) * finalConfig.spacing;

  const blockWidth = availableWidth / cols;
  const blockHeight = availableHeight / rows;

  // Make blocks square (use the smaller dimension)
  const size = Math.min(blockWidth, blockHeight) * 0.9; // 10% spacing

  const getPosition = (index: number) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      x:
        finalConfig.margin +
        col * (blockWidth + finalConfig.spacing) +
        (blockWidth - size) / 2,
      y:
        finalConfig.margin +
        row * (blockHeight + finalConfig.spacing) +
        (blockHeight - size) / 2
    };
  };

  return {
    blockWidth: size,
    blockHeight: size,
    getPosition
  };
}
