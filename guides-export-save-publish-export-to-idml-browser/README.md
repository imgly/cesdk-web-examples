# Export to IDML and PSD

Edit a CE.SDK design and download it for Adobe InDesign or Adobe Photoshop. Open the **Export** dropdown and choose **IDML (InDesign)** or **PSD (Photoshop)**. Both exports run in the browser, share a busy state, and report failures. A notification indicates when exported content or fonts need review. Rendering can differ between CE.SDK and the Adobe applications.

This example uses `@imgly/idml-exporter` and `@imgly/psd-exporter`, which are released independently of CE.SDK. Their minimum peer version is an API compatibility requirement; export quality also depends on the installed CE.SDK runtime and the design's content.

In the monorepo, run this example through its Nx `dev` target after the SDK and exporter artifacts are available. The distributed example uses `npm install` and `npm run dev`. To use a license, copy `.env.example` to `.env` and uncomment the license line in `index.ts`.

The initial design is the Northgate Advisory strategy quote from IMG.LY’s design templates (`social-templates/008-corporate-clean-strategy-quote/ig-post/en`). Its bundled archive includes the fonts. This template is demo content; replace it with your own content for production.

## IDML download

Unzip `design-idml.zip`, then open `design/design.idml` in Adobe InDesign with the `Document fonts` folder beside it. Check the document in InDesign before delivering it. Some paints and text styles become images; that content is no longer editable.

This example uses the published 0.1.0 IDML exporter. Representative validation covered SDK 1.83, CoDesign, and opening, editing, saving, and reopening in Adobe. The browser export was checked in InDesign: all five text frames remain editable, the fonts are available and no text frame overflows.

## PSD download

`design-psd.zip` contains one PSD document per page: `page-1.psd`, `page-2.psd`, and so on. Open them in Photoshop with the design's fonts installed. Some text and effects become pixel layers; the browser console lists the export messages when content needs review.

PSD export in the browser needs a `@imgly/psd-exporter` release newer than 0.1.0. Version 0.1.0 runs only in Node.js.
