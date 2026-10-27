/**
 * Where this kit's demo assets (scenes, images, fonts, …) are loaded from.
 * Set `VITE_DEMO_ASSETS_BASE_URL` in `.env` to serve them from your own CDN or
 * server. Without it the kit reads them from the IMG.LY CDN. No trailing slash.
 */

// The engine resolves a relative URI against its own asset base, not the page,
// so the URL has to be absolute.
const configured: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ??
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.85.0/demo-illustrator-template-import';

export const DEMO_ASSETS_BASE_URL: string = (
  typeof location === 'undefined'
    ? configured
    : new URL(configured, location.href).href
).replace(/\/$/, '');
