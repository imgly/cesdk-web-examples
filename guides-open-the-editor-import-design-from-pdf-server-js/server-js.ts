import CreativeEngine from '@cesdk/node';
import {
  PDFParser,
  addGfontsAssetLibrary,
  editableFirstStrategy
} from '@imgly/pdf-importer';
import { config } from 'dotenv';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

// A sample document from the PDF Template Import starter kit.
const SAMPLE_URL =
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.87.0-rc.1/starterkit-pdf-template-import/cases/pdf-template-import/postcard.pdf';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

// Keep glyphs such as ♥ or ★ in the font the PDF embeds, instead of the
// emoji font the engine substitutes by default.
engine.editor.setSetting('forceSystemEmojis', false);

// The importer resolves PDF fonts through the Google Fonts asset library,
// so we register it once for the run.
await addGfontsAssetLibrary(engine);

const outputDirectory = new URL('./output/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

// `editableFirstStrategy`, the default, prefers a typeface from the asset
// library, then the font embedded in the PDF, then a substitute.
// `exactFidelityStrategy` never substitutes and draws unmatched text as
// vector outlines instead.
const fontStrategy = editableFirstStrategy;

/**
 * Converts one PDF and writes an archive, a preview image and a scene
 * string with stable URLs to the output directory.
 */
async function convertDocument(buffer: ArrayBuffer, name: string) {
  // `parse()` replaces the current scene with the PDF, one page per PDF
  // page. `@cesdk/node` exports its own engine class, so the importer's
  // engine type needs the cast.
  const parser = await PDFParser.fromFile(engine as any, buffer, {
    fontStrategy
  });
  const { logger } = await parser.parse();
  const pages = engine.scene.getPages();
  console.log(`${name}: imported ${pages.length} page(s)`);

  // Each message has a stable `code`, a `type` and a readable `message`.
  for (const message of logger.getMessages()) {
    if (message.type !== 'info') {
      console.warn(`  [${message.code}] ${message.message}`);
    }
  }

  // The archive bundles the scene with the images and fonts the importer
  // extracted from the PDF. It loads in the browser and in Node.js.
  const archive = await engine.scene.saveToArchive();
  await writeFile(
    new URL(`${name}.imgly`, outputDirectory),
    Buffer.from(await archive.arrayBuffer())
  );

  const png = await engine.block.export(pages[0], { mimeType: 'image/png' });
  await writeFile(
    new URL(`${name}.png`, outputDirectory),
    Buffer.from(await png.arrayBuffer())
  );

  // Optional: save the scene as a string with stable URLs instead.
  // The importer stores extracted images and embedded fonts under transient
  // `buffer://` URIs, which only an archive keeps. For `saveToString()`, upload each buffer
  // first and point the scene at the uploaded file.

  // Replace with the upload to your storage. Here a file next to the scene
  // stands in for the permanent URL. The data is a view into the engine's
  // memory, so copy it before the asynchronous write.
  const uploadToBackend = async (data: Uint8Array, index: number) => {
    const fileURL = new URL(`${name}-resource-${index}`, outputDirectory);
    await writeFile(fileURL, Buffer.from(data));
    return fileURL.href;
  };

  // The list holds every transient resource, so keep only the importer's
  // `buffer://` URIs, embedded fonts included.
  const resources = engine.editor.findAllTransientResources();
  for (const [index, resource] of resources.entries()) {
    const { URL: bufferUri, size } = resource;
    if (!bufferUri.startsWith('buffer://')) continue;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data, index);
    engine.editor.relocateResource(bufferUri, permanentUrl);
    // Relocating does not free the buffer, so a batch would keep the
    // resources of every converted file in memory.
    engine.editor.destroyBuffer(bufferUri);
  }
  const sceneString = await engine.scene.saveToString();
  await writeFile(new URL(`${name}.scene`, outputDirectory), sceneString);
}

try {
  try {
    const response = await fetch(SAMPLE_URL);
    if (!response.ok) throw new Error(`Could not download ${SAMPLE_URL}`);
    await convertDocument(await response.arrayBuffer(), 'postcard');
  } catch (error) {
    // Without network access, the files in ./input still convert.
    console.error(`Sample: ${(error as Error).message}`);
  }

  // Convert every PDF in ./input, if the directory exists.
  const inputDirectory = new URL('./input/', import.meta.url);
  let inputFiles: string[] = [];
  try {
    inputFiles = await readdir(inputDirectory);
  } catch {
    console.log('No ./input directory. Put PDF files there to convert them.');
  }
  for (const fileName of inputFiles) {
    if (extname(fileName).toLowerCase() !== '.pdf') continue;
    const bytes = await readFile(new URL(fileName, inputDirectory));
    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    );
    try {
      // The prefix keeps ./input/postcard.pdf from overwriting the sample.
      const name = `input-${basename(fileName, extname(fileName))}`;
      await convertDocument(buffer, name);
    } catch (error) {
      // One broken file does not stop the batch.
      console.error(`${fileName}: ${(error as Error).message}`);
    }
  }
} finally {
  engine.dispose();
}
