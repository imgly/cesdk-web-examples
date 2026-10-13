# PDF/X Export in Node.js

Create a postcard with CMYK artwork, text and 3 mm bleed. Export it directly from CE.SDK with `exportPDFX`, check it with `checkPDFX` and write it to `output/postcard-pdfx4.pdf`.

The example also demonstrates `convertToPDFX` for an existing PDF and saves `output/postcard-converted-pdfx4.pdf`. That conversion path does not infer bleed from the CE.SDK scene.

## Run

Requires Node.js 22 or later.

```sh
npm install
npm run dev
```

Without a license, CE.SDK adds a watermark. To use your license, copy `.env.example` to `.env`, set `CESDK_LICENSE` and uncomment the license option in `server-js.ts`.

The exporter loads its WebAssembly module from the installed package on disk. No conversion worker or asset server is required.

See the [PDF/X export documentation](https://img.ly/docs/cesdk/node/plugins/print-ready-pdf-iroalu/) for standards, custom ICC profiles and printer's mark limits.
