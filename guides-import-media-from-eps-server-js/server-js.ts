import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { EPSImportError, replaceEPS } from '@imgly/eps-importer';
import { createConversionRuntime } from '@imgly/pdf-conversion-utils';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

const runtime = createConversionRuntime();
try {
  const template = await readFile(
    new URL('./public/template.scene', import.meta.url),
    'utf8'
  );
  await engine.scene.loadFromString(template);

  const matches = engine.block.findByName('Artwork');
  if (matches.length !== 1)
    throw new Error('Expected exactly one Artwork placeholder');
  const target = matches[0];
  let ancestor: number | null = target;
  while (
    ancestor !== null &&
    engine.block.getType(ancestor) !== '//ly.img.ubq/page'
  ) {
    ancestor = engine.block.getParent(ancestor);
  }
  if (ancestor === null) throw new Error('Artwork must belong to a page');
  const page = ancestor;

  const bytes = new Uint8Array(
    await readFile(new URL('./public/artwork.eps', import.meta.url))
  );
  const result = await replaceEPS(engine, bytes, {
    target,
    runtime,
    limits: { maxInputBytes: 20 * 1024 * 1024, timeoutMs: 30_000 }
  });

  for (const diagnostic of result.diagnostics) {
    console.info(`[${diagnostic.stage}] ${diagnostic.message}`);
  }
  console.info(
    `Imported native group ${result.group}: ${result.width} × ${result.height}`
  );

  const outputDirectory = new URL('./output/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const pdf = await engine.block.export(page, {
    mimeType: 'application/pdf',
    exportPdfWithDeviceCMYK: true
  });
  await writeFile(
    new URL('eps-artwork.pdf', outputDirectory),
    new Uint8Array(await pdf.arrayBuffer())
  );
  const archive = await engine.scene.saveToArchive();
  await writeFile(
    new URL('eps-artwork.imgly', outputDirectory),
    new Uint8Array(await archive.arrayBuffer())
  );
} catch (error) {
  if (error instanceof EPSImportError)
    console.error(error.code, error.diagnostics);
  throw error;
} finally {
  runtime.dispose();
  engine.dispose();
}
