# Export to IDML and PSD

Edit a CE.SDK design and download an IDML package containing every page and the available document fonts. Unzip `design-idml.zip`, then open `design/design.idml` in Adobe InDesign with the `Document fonts` folder beside it.

Open the **Export** dropdown and choose **IDML (InDesign)** or **PSD (Photoshop)**. Both downloads share a busy state and report failures. A notification indicates when exported content or fonts need review. Check the document in InDesign before delivering it. Some paints and text styles become images; that content is no longer editable. Rendering can differ between CE.SDK and InDesign.

This example uses `@imgly/idml-exporter`, which is released independently of CE.SDK. Its minimum peer version is an API compatibility requirement; export quality also depends on the installed CE.SDK runtime and the design's content.

In the monorepo, run this example through its Nx `dev` target after the SDK and exporter artifacts are available. The distributed example uses `npm install` and `npm run dev`. To use a license, copy `.env.example` to `.env` and uncomment the license line in `index.ts`.

This example uses the published 0.1.0 exporter. Representative validation covered SDK 1.83, CoDesign, and opening, editing, saving, and reopening in Adobe.

The initial design is the Northgate Advisory strategy quote from IMG.LY’s design templates (`social-templates/008-corporate-clean-strategy-quote/ig-post/en`). Its bundled archive includes the fonts. The browser export was checked in InDesign: all five text frames remain editable, the fonts are available and no text frame overflows. This template is demo content; replace it with your own content for production.

## PSD download

The same editor can send the current design, including edits, to a Node.js PSD export endpoint. Set `VITE_PSD_EXPORT_URL` before starting or building the example. Without it, the PSD menu entry is disabled and marked unavailable; IDML export remains available. The PSD exporter currently needs Node.js because it uses a native graphics library. IDML runs in the browser and can also be used with React, Vue, Angular, and other frameworks.

The endpoint accepts the scene archive as a raw `application/zip` POST body and returns an `application/zip` package containing a PSD document for each page. It must return `X-Export-Warning-Count` as a nonnegative integer and expose that header through CORS when hosted on another origin. A warning notification tells the user to review the exported documents in Photoshop. The browser stops waiting after 120 seconds and reports the timeout.

The server must configure its own CE.SDK license; do not put server credentials in the browser environment. The browser makes this request without cookies or other browser credentials.
