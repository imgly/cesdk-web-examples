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
  spacing: 10,
  margin: 20
};

/**
 * Calculate a responsive grid layout for demonstrating multiple text blocks
 * with variables. Returns block dimensions and a position calculator.
 */
export function calculateGridLayout(
  pageWidth: number,
  pageHeight: number,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridLayout {
  // Calculate optimal grid dimensions based on item count
  const cols = config.cols;
  const rows = config.rows;

  // Calculate available space after margins and spacing
  const availableWidth =
    pageWidth - 2 * config.margin - (cols - 1) * config.spacing;
  const availableHeight =
    pageHeight - 2 * config.margin - (rows - 1) * config.spacing;

  // Calculate block dimensions
  const blockWidth = availableWidth / cols;
  const blockHeight = availableHeight / rows;

  // Position calculator function
  const getPosition = (index: number) => ({
    x: config.margin + (index % cols) * (blockWidth + config.spacing),
    y: config.margin + Math.floor(index / cols) * (blockHeight + config.spacing)
  });

  return { blockWidth, blockHeight, getPosition };
}

/**
 * Helper to convert hex color to RGBA object for CE.SDK
 */
export function hexToRgba(
  hex: string,
  alpha: number = 1
): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: alpha
  };
}
