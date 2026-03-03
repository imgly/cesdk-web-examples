import QRCode from 'qrcode';

/**
 * Generate SVG path data for a QR code from a URL.
 * Returns the path data string that can be used with CE.SDK vector_path shapes.
 */
export async function generateQRCodePath(url: string): Promise<string> {
  // Generate QR code as SVG string
  const svgString = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 0,
  });

  // Extract path data from SVG
  const pathMatch = svgString.match(/d="([^"]+)"/);
  if (!pathMatch) {
    throw new Error('Failed to extract path data from QR code SVG');
  }

  return pathMatch[1];
}

/**
 * Generate QR code as a data URL image.
 * Returns a base64-encoded data URL that can be used as an image fill.
 */
export async function generateQRCodeDataURL(
  url: string,
  options?: {
    width?: number;
    color?: { dark: string; light: string };
  },
): Promise<string> {
  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: options?.width ?? 256,
    color: options?.color ?? { dark: '#000000', light: '#ffffff' },
  });

  return dataUrl;
}
