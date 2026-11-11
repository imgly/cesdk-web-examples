/** Bundled samples can be served alongside the showcase or from a custom asset host. */
const configured: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ?? import.meta.env.BASE_URL;

export const DEMO_ASSETS_BASE_URL: string = (
  typeof location === 'undefined'
    ? configured
    : new URL(configured, location.href).href
).replace(/\/$/, '');
