# EPS Artwork Gallery

A Vanilla TypeScript showcase that connects EPS artwork to the editor's media Gallery through a reusable `EditorPlugin`. Open **EPS Artwork**, select the included sample, or add an EPS file through the Gallery's **Add File** button. The outer upload button and drop zone also add files to the same Gallery. Uploading does not insert artwork; selecting a card creates a new editable group in the current design. Select the same card again to create an independent instance.

Choose **Replace “Artwork” placeholder** to replace the template's explicitly named rectangular placeholder. The rest of the page stays in place. Cancel or retry an import from the status area. **Download PDF** exports the current page with Device CMYK enabled; it does not claim PDF/X compliance.

The editor includes a **Layers** panel for selecting, renaming and hiding objects, including children inside EPS groups. Double-click imported artwork to enter its group, then use the contextual toolbar to edit fills, strokes, opacity, position and size. Group/ungroup, duplicate/delete, alignment and layer ordering are available, along with font size, alignment and spacing for editable text. Undo/redo also applies to these edits. `src/imgly/config/editor-ui.ts` configures the built-in editor components and a small Layers panel using the public panel builder, independently of the Gallery plugin. This also supports editor releases that predate the native Layers panel.

## Run the published showcase

Requires Node.js 22 or later and CE.SDK 1.82 or later.

```sh
curl -L https://cdn.img.ly/demo/cesdk-web-examples/v1.82.2/examples/demo-eps-import/source.zip -o eps-gallery.zip
unzip eps-gallery.zip -d eps-gallery
cd eps-gallery
npm install
npm run dev
```

The public example uses CE.SDK 1.82.2, `@imgly/eps-importer@0.1.0`, and `@imgly/pdf-conversion-utils@0.1.0`. Its dependencies include the compatible PDF importer. Add your CE.SDK license to the editor configuration in `src/index.ts` before production use. Run `npm run build` and serve the entire `dist/` directory, including the conversion and font assets described below.

## Repository development

From the repository root:

```sh
pnpm exec nx run demo-eps-import:build
pnpm --filter demo-eps-import dev
```

The dev server uses port 5173 and fails if that port is already occupied. Use the existing server when it already serves this example. CE.SDK asset and license configuration follows the other web examples; the `cesdk-js-dev` wrapper supplies local engine assets.

Copy `.env.example` to `.env` to configure `VITE_CESDK_LICENSE` or `VITE_IMGLY_LOCAL_ASSETS_URL`. Do not commit license keys.

## Reuse the Gallery plugin

`src/imgly/plugins/eps-gallery-plugin.ts` uses only public CE.SDK APIs: a local asset source with a custom apply callback, an asset-library entry, a dock entry, and a source-specific `uploadFile` handler. Other upload sources retain their existing handler. No engine change or raster fallback is involved.

```ts
import { EPSGalleryPlugin } from './imgly';

const gallery = new EPSGalleryPlugin({
  importFile: async (file) => {
    const result = await placeEPS(cesdk.engine, file, {
      parent: cesdk.engine.scene.getCurrentPage()!,
      frame: { x: 54, y: 180, width: 360, height: 240 },
      runtime
    });
    cesdk.engine.block.select(result.group);
    return result.group;
  }
});
await cesdk.addPlugin(gallery);
gallery.open();
// Before disposing the editor:
// gallery.dispose();
```

The host owns placement/replacement, progress, error handling and cancellation. The showcase reuses its existing import flow, including the importer's undo steps. Conversion assets remain lazy: opening the Gallery or adding a file does not load Ghostscript.

Uploaded files use session-local blob URLs and a clearly marked EPS file icon, not a rendered preview. The sample has an authored thumbnail. URLs are released when the page closes; the Gallery starts fresh on reload. Imported artwork and its embedded resources can still be saved in a scene archive. For a persistent Gallery, replace blob storage with your backend and supply thumbnails; serve the demo's two thumbnail SVGs alongside the copied plugin or adapt their URLs.

The editor's built-in file picker supports PostScript MIME types. For EPSF/EPSI or DOS EPS files whose MIME type the browser does not identify, use **Add EPS to Gallery** or the outer drop zone, which accept the file extension. Full EPS validation happens when inserting artwork, with errors shown in the import status.

## Import and runtime lifecycle

The editor and template become usable before conversion assets are loaded. The first import dynamically loads the importer and prepares one shared conversion runtime. Progress is indeterminate; the demo does not estimate percentages. Cancellation aborts the current operation and leaves the design usable. The runtime is disposed when the page closes.

```ts
import { placeEPS, replaceEPS } from '@imgly/eps-importer';
import { createConversionRuntime } from '@imgly/pdf-conversion-utils';

const runtime = createConversionRuntime({
  assetBaseURL: new URL('pdf-conversion/', document.baseURI)
});

const artwork = await placeEPS(engine, file, {
  parent: page,
  frame: { x: 54, y: 180, width: 360, height: 240 },
  runtime,
  signal: controller.signal
});
engine.block.select(artwork.group);

// Use an explicitly chosen, supported rectangular placeholder.
await replaceEPS(engine, file, { target: placeholder, runtime });
```

Frame values use the scene's design unit. This demo uses pixels at 72 DPI, so its layout coordinates match PostScript points. EPS source bounds are reported in PostScript points. For applications that choose to preload, call `runtime.preload()` only after the editor and its scene are usable.

## Conversion assets and deployment

The Vite plugin serves `worker.browser.js`, `gs.js`, and `gs.wasm` from `@imgly/pdf-conversion-utils` under `pdf-conversion/` during development and copies those files, `COPYING.AGPL-3.0`, `LICENSE.md`, `PROVENANCE.md` and `THIRD_PARTY_NOTICES.md` into the build output. Retain these documents with the deployed runtime; they include its full license, third-party notices and matching Ghostscript and wrapper source links. It also copies PDF.js standard fonts beside the emitted importer chunk. Serve the entire output directory, including those folders. A deployment below a URL prefix must set Vite's `base`; asset URLs then remain relative to the demo. `VITE_CONVERSION_ASSETS_URL` can point to a separately hosted conversion asset directory.

The showcase is registered in the web demo Gallery and documented in the published EPS Artwork Gallery guide. The source publisher materializes the demo and Browser/Node guides with registry dependency versions and standalone editor configuration. `private: true` prevents publishing the example itself as an npm package; it does not prevent public source or CDN distribution.

## Verification

```sh
pnpm --filter demo-eps-import check:all
EPS_DEMO_URL=http://127.0.0.1:5173 pnpm --filter demo-eps-import test:smoke
```

The browser smoke test requires a running demo server and an installed Playwright Chromium browser. Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Google Chrome instead. It checks lazy loading, Gallery selection, uploads without immediate insertion, repeated native placement, group scaling, placeholder replacement, undo/redo, cancellation, retry after invalid EPS input, PDF download, and editable native objects after saving and reloading a scene archive. It does not start another server. Screenshots and exported PDFs are written to `output/playwright/`.

The sample `public/artwork.eps` is synthetic: a K-only black rectangle, a cyan circle, and opaque white rectangles. It has a non-zero bounding-box origin to exercise placement normalization. It contains no customer artwork or external fonts.

This demo exports standard PDF. PDF/X-3 production validation, spot colors, and complex overprint workflows require separate fixture and output-profile validation; the showcase makes no compliance claim.
