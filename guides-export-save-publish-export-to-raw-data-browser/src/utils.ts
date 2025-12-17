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
  itemCount: number = 9,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  // Calculate optimal grid dimensions
  const cols = Math.min(config.cols, Math.ceil(Math.sqrt(itemCount)));
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
