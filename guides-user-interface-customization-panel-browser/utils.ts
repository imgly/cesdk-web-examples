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
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  const availableWidth =
    pageWidth - 2 * config.margin - (config.cols - 1) * config.spacing;
  const availableHeight =
    pageHeight - 2 * config.margin - (config.rows - 1) * config.spacing;
  const blockWidth = availableWidth / config.cols;
  const blockHeight = availableHeight / config.rows;

  const getPosition = (index: number) => ({
    x: config.margin + (index % config.cols) * (blockWidth + config.spacing),
    y:
      config.margin +
      Math.floor(index / config.cols) * (blockHeight + config.spacing)
  });

  return { blockWidth, blockHeight, getPosition };
}
