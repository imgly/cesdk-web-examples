import CreativeEngine from '@cesdk/node';
import { PPTXParser, addGfontsAssetLibrary } from '@imgly/pptx-importer';
import { config } from 'dotenv';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

// A sample presentation from the PowerPoint Template Import starter kit.
const SAMPLE_URL =
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.87.0-rc.1/starterkit-pptx-template-import/cases/pptx-template-import/example-3-social.pptx';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

// The importer matches slide fonts against the Google Fonts asset library.
// `PPTXParser.fromFile()` registers it on the first import; registering it
// here makes a failed fetch stop the run before the first file.
await addGfontsAssetLibrary(engine);

const outputDirectory = new URL('./output/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

/**
 * Converts one presentation and writes an archive, a preview image and a
 * scene string with stable URLs to the output directory.
 */
async function convertPresentation(buffer: ArrayBuffer, name: string) {
  // `parse()` adds the slides to the current scene, so each presentation
  // starts a new one. The importer sets the scene to 96 DPI, the
  // resolution of PowerPoint's own pixel sizes. `@cesdk/node` exports its
  // own engine class, so the importer's engine type needs the cast.
  engine.scene.create('VerticalStack');
  const parser = await PPTXParser.fromFile(engine as any, buffer);
  const result = await parser.parse();
  const pages = engine.scene.getPages();
  console.log(`${name}: imported ${pages.length} slide(s)`);

  // Each message has a stable `code`, a `type` and a readable `message`.
  for (const message of result.logger.getMessages()) {
    if (message.type !== 'info') {
      console.warn(`  [${message.code}] ${message.message}`);
    }
  }

  // The archive bundles the scene with the images the importer extracted
  // from the presentation. It loads in the browser and in Node.js.
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
  // The importer stores slide images under transient `buffer://` URIs,
  // which only an archive keeps. For `saveToString()`, upload each buffer
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
  // `buffer://` URIs, the slide images.
  const resources = engine.editor.findAllTransientResources();
  for (const [index, resource] of resources.entries()) {
    const { URL: bufferUri, size } = resource;
    if (!bufferUri.startsWith('buffer://')) continue;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data, index);
    engine.editor.relocateResource(bufferUri, permanentUrl);
    // Relocating does not free the buffer, so a batch would keep the
    // images of every converted file in memory.
    engine.editor.destroyBuffer(bufferUri);
  }
  const sceneString = await engine.scene.saveToString();
  await writeFile(new URL(`${name}.scene`, outputDirectory), sceneString);
}

try {
  try {
    const response = await fetch(SAMPLE_URL);
    if (!response.ok) throw new Error(`Could not download ${SAMPLE_URL}`);
    await convertPresentation(await response.arrayBuffer(), 'example-3-social');
  } catch (error) {
    // Without network access, the files in ./input still convert.
    console.error(`Sample: ${(error as Error).message}`);
  }

  // Convert every presentation in ./input, if the directory exists.
  const inputDirectory = new URL('./input/', import.meta.url);
  let inputFiles: string[] = [];
  try {
    inputFiles = await readdir(inputDirectory);
  } catch {
    console.log('No ./input directory. Put PPTX files there to convert them.');
  }
  for (const fileName of inputFiles) {
    if (extname(fileName).toLowerCase() !== '.pptx') continue;
    const bytes = await readFile(new URL(fileName, inputDirectory));
    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    );
    try {
      // The prefix keeps an input file from overwriting the sample's output.
      const name = `input-${basename(fileName, extname(fileName))}`;
      await convertPresentation(buffer, name);
    } catch (error) {
      // One broken file does not stop the batch.
      console.error(`${fileName}: ${(error as Error).message}`);
    }
  }
} finally {
  engine.dispose();
}
