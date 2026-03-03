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
  rows: 2,
  spacing: 20,
  margin: 40
};

export function calculateGridLayout(
  pageWidth: number,
  pageHeight: number,
  itemCount: number,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  // Calculate optimal grid dimensions based on item count
  const cols = Math.min(config.cols, itemCount);
  const rows = Math.ceil(itemCount / cols);

  const availableWidth =
    pageWidth - 2 * config.margin - (cols - 1) * config.spacing;
  const availableHeight =
    pageHeight - 2 * config.margin - (rows - 1) * config.spacing;
  const blockWidth = availableWidth / cols;
  const blockHeight = availableHeight / rows;

  const getPosition = (index: number) => ({
    x: config.margin + (index % cols) * (blockWidth + config.spacing),
    y: config.margin + Math.floor(index / cols) * (blockHeight + config.spacing)
  });

  return { blockWidth, blockHeight, getPosition };
}
