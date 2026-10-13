# PDF/X Exporter Browser Example

Export every page of a CE.SDK design as PDF/X-1a, PDF/X-3 or PDF/X-4 with
`@imgly/pdfx-exporter`. The example uses a FOGRA39 printer profile, preserves
3 mm page bleed and checks conformance before downloading each PDF.

## Run

Requires Node.js 22+ for development and a browser with WebAssembly SIMD
(Chrome, Edge, Firefox or Safari 16.4+).

```bash
npm install
npm run dev
```

Edit the postcard and choose **Export PDF/X-4**, **Export PDF/X-3** or
**Export PDF/X-1a**. PDF/X-4 preserves live transparency; X-1a and X-3 flatten
transparency. Failed exports and conformance findings appear in the editor.

The editor runs with a watermark. Set the commented `license` option in
`src/index.ts` to remove it with a [CE.SDK license](https://img.ly/forms/contact-sales/).

## Build and deploy

```bash
npm run build
npm run preview
```

Deploy the complete `dist/` directory. The Vite plugin serves and copies the
exporter's `dist/` and `wasm/` directories as siblings under `pdfx-exporter/`.
Keep that tree intact: the loader resolves WASM and its JavaScript glue relative
to the exporter modules. `LICENSE.md` and `ICC-PROFILE-LICENSES.md` are included.
The exporter version is independent of the CE.SDK version.

`exportPDFX` handles engine export, page selection and bleed. Use
`convertToPDFX` for PDF Blobs you already have. `checkPDFX` returns a list of
conformance findings; an empty list means the checker found no violations.
The `convertExistingPDF` function demonstrates the existing-PDF path.

FOGRA39 and GRACoL are printer profiles. sRGB is a display profile and its output
is not PDF/X compliant. `nonPrinterProfile: 'reject'` refuses such profiles.

See the [PDF/X documentation](https://img.ly/docs/cesdk/js/plugins/print-ready-pdf-iroalu/).
