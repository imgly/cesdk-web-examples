import type { Color } from '@cesdk/node';

/**
 * Convert hex color string to RGBA color object.
 * @param hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns Color object with r, g, b, a values in 0-1 range
 */
export function hexToRgba(hex: string): Color {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return { r, g, b, a: 1.0 };
}
