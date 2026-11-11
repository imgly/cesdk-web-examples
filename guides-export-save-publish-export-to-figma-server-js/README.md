# Export to Figma

Run this Node.js recipe to export a CE.SDK scene as a `.fig` file.

Install dependencies, then run `npm run dev`. Node.js 22.15 or later (23.x requires 23.8+) is required. To use a CE.SDK license, set `CESDK_LICENSE` and uncomment the license setting in `server-js.ts`.

By default, the recipe creates two pages containing native colored rectangles. Set `FIGMA_SOURCE_ARCHIVE` to an absolute or working-directory-relative `.imgly` path to export an existing design instead.

The recipe writes `output/design.fig`, a source PNG for each page, and `output/export-report.json`. The PNGs show CE.SDK rendering. Import the `.fig` through Figma's file browser, open it in the editor, and compare its frames with those references. Review the report for raster fallbacks, skipped content, and other approximations.

One CE.SDK scene becomes one Figma canvas with a frame per page. No Figma API token is needed for file export. Conversion is best effort and does not guarantee identical rendering in Figma.
