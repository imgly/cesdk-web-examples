# Lottie Animation Import

Import a Lottie `.json` file or a dotLottie `.lottie` archive into a CE.SDK video scene as editable blocks. The sidebar accepts file uploads and drag and drop, and includes both sample formats. An import adds one group to the existing page; undo removes it.

Supported layers keep their animation as keyframes. Layers without a native mapping play as animation fills, and the sidebar shows their names and fallback reasons. A failed import leaves the existing design in place.

## Run

Use Node.js 22 or newer. Install dependencies and set the `license` property in `CreativeEditorSDK.create` in `src/imgly/index.ts` to your CE.SDK Web license. Then run `npm run dev`. In the monorepo, you can instead copy `.env.example` to `.env.local` and set `VITE_CESDK_LICENSE`.

`npm run build` builds the showcase; `npm run preview` serves that build. In the monorepo, use the root package manager (`pnpm --filter demo-lottie-import dev`) and the workspace build runner.

The importer requires CE.SDK 1.85.0 or later. Importing dotLottie archives needs Safari 16.4 or newer. Its APIs are experimental.

## Integration

`src/imgly/import.ts` reads the file bytes and calls `LottieImporter.fromFile(cesdk.engine, bytes)`. The importer detects JSON or ZIP content. `src/imgly/index.ts` initializes the video editor; `src/index.ts` wires uploads, samples and the fallback report.

This showcase accepts files up to 100 MB. Upload size is checked before reading, and the same limit is checked before passing sample or uploaded bytes to the importer.

The two badge samples are shared with the [Import Lottie Animations guide](https://img.ly/docs/cesdk/js/import-media/lottie-6bb9ab/). The sample deliberately includes a 3D layer to show a playback fallback. Browser uploads cannot resolve relative files outside a JSON document; use embedded resources or a dotLottie archive that bundles its images and fonts.

## Verification

`npm run check:all` checks TypeScript, formatting and lint. `npm run test:unit` checks the showcase's byte forwarding, serialized imports, selection and undo wiring, invalid files, read/import failures and disposal. `npm run test:distribution` verifies standalone source publication and the gallery's source download. `npm run test:e2e` runs the browser journey described in `tests/TEST-PLAN.md`. The importer's own suite covers format mapping and rollback. Tests are monorepo tooling and are omitted from the published example.

For a browser check, import both samples, edit a native layer, play the timeline, and undo the latest import. Upload invalid JSON and confirm its error appears while the previous animation remains editable. Check keyboard file selection, drag and drop, a narrow viewport and reduced motion.
