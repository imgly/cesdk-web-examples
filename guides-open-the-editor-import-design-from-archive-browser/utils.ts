export interface GridConfig {
  spacing?: number;
  margin?: number;
}

export interface GridLayout {
  blockWidth: number;
  blockHeight: number;
  getPosition: (index: number) => { x: number; y: number };
}

export function calculateGridLayout(
  pageWidth: number,
  pageHeight: number,
  itemCount: number,
  config: GridConfig = {}
): GridLayout {
  const spacing = config.spacing ?? 20;
  const margin = config.margin ?? 40;

  // Calculate optimal grid dimensions
  const cols = Math.ceil(Math.sqrt(itemCount));
  const rows = Math.ceil(itemCount / cols);

  // Calculate available space
  const availableWidth = pageWidth - 2 * margin - (cols - 1) * spacing;
  const availableHeight = pageHeight - 2 * margin - (rows - 1) * spacing;

  // Calculate block dimensions (maintain aspect ratio where possible)
  const blockWidth = availableWidth / cols;
  const blockHeight = availableHeight / rows;

  const getPosition = (index: number) => ({
    x: margin + (index % cols) * (blockWidth + spacing),
    y: margin + Math.floor(index / cols) * (blockHeight + spacing)
  });

  return { blockWidth, blockHeight, getPosition };
}
