import googleFonts from './google-fonts.json';

type FontVariants = (typeof googleFonts.items)[number]['files'];

export type Font = { name: string; style: string };

/**
 * The default font resolver for the IDML parser.
 * This will try to find a matching google font variant for the given font.
 *
 * @param font The font to resolve
 * @returns The font URI or null if no matching font was found
 */
export default function fontResolver({ name, style }: Font) {
  const fontVariant = fontVariantMap.get(style);
  if (!fontVariant) return null;
  const font = googleFonts.items.find((font) => font.family === name);
  const fontURI = font?.files[fontVariant as keyof FontVariants];
  return fontURI ?? null;
}

// Map of font styles to google font variants
const fontVariantMap = new Map([
  ['Thin', '100'],
  ['Thin Italic', '100italic'],
  ['Extra-light', '200'],
  ['Extra-light Italic', '200italic'],
  ['Light', '300'],
  ['Light Italic', '300italic'],
  ['Regular', 'regular'],
  ['Regular Italic', 'italic'],
  ['Medium', '500'],
  ['Medium Italic', '500italic'],
  ['Semi-bold', '600'],
  ['Semi-bold Italic', '600italic'],
  ['Bold', '700'],
  ['Bold Italic', '700italic'],
  ['Extra-bold', '800'],
  ['Extra-bold Italic', '800italic'],
  ['Black', '900'],
  ['Black Italic', '900italic']
]);
