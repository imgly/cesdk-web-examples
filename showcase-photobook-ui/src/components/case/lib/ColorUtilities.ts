import { RGBAColor } from '@cesdk/engine';

// Convert a hex color string to an RGBA color object
export function hexToRgba(hex: string): RGBAColor {
  if (hex.length === 2) {
    hex = hex.replace(/#([0-9a-fA-F])/g, '#$1$1$1$1$1$1');
  }
  if (hex.length === 4) {
    hex = hex.replace(
      /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/g,
      '#$1$1$2$2$3$3'
    );
  }
  const alphaHex = hex.length === 9 ? hex.slice(7, 9) : 'FF';

  if (![7, 9].includes(hex.length)) {
    throw new Error(
      'hexToRgba expects a hex string of length 7 (including #).' + hex
    );
  }

  const color = {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: parseInt(alphaHex, 16) / 255 // Assuming the alpha channel is always fully opaque for hex colors
  };
  return color;
}

// Convert an RGBA color object to a hex color string
export function rgbaToHex({ r, g, b, a }: RGBAColor): string {
  const to255Int = (value: number) => Math.round(value * 255);
  r = to255Int(r);
  g = to255Int(g);
  b = to255Int(b);
  a = to255Int(a);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  // Convert values to a hex string, including alpha
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

const PRECISION = 0.001;

export const isColorEqual = (
  colorA: RGBAColor,
  colorB: RGBAColor,
  precision = PRECISION
) => {
  return (
    Math.abs(colorB.r - colorA.r) < precision &&
    Math.abs(colorB.g - colorA.g) < precision &&
    Math.abs(colorB.b - colorA.b) < precision &&
    Math.abs(colorB.a - colorA.a) < precision
  );
};
