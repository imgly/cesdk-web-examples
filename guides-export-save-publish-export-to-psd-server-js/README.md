# Export to PSD

Run this Node.js recipe to load a CE.SDK scene, export one PSD per page, and save the files under `output/`. It requires Node.js 22 or later. It is a server recipe; it does not provide a hosted browser export endpoint.

The generated files are `page-1.psd`, `page-2.psd`, and so on, plus `page-1-source.png`, `page-2-source.png`, and `export-report.json`. The PNGs show the CE.SDK source appearance. They are not renders of the exported PSDs and do not verify Photoshop parity. Open each PSD in Adobe Photoshop and review the export report before handoff.

Supported layers and text remain editable. Some effects and text styles, including warped text, need raster fallback. Available fonts and the installed CE.SDK runtime affect the result. The exporter package is released independently of CE.SDK; its minimum peer version is an API compatibility requirement.

In the monorepo, run this example through its Nx `dev` target after the SDK and exporter artifacts are available. The distributed example uses `npm install` and `npm run dev`. To use a license, copy `.env.example` to `.env` and uncomment the license line in `server-js.ts`.

This example uses the published 0.1.0 exporter. Representative validation covered SDK 1.83, CoDesign, and opening, editing, saving, and reopening in Adobe.
