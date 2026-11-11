import CreativeEngine from '@cesdk/node';
import { PDFParser, addGfontsAssetLibrary } from '@imgly/pdf-importer';
import { config } from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  // An existing design: one square page with a background color.
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1080);
  engine.block.setHeight(page, 1080);
  const background = engine.block.createFill('color');
  engine.block.setFill(page, background);
  engine.block.setColor(background, 'fill/color/value', {
    r: 0.93,
    g: 0.93,
    b: 0.95,
    a: 1
  });
  engine.block.appendChild(scene, page);

  await addGfontsAssetLibrary(engine);
  const bytes = await readFile(
    new URL('./public/summer-market.pdf', import.meta.url)
  );
  // The importer bundles its own engine types, hence the cast.
  const parser = await PDFParser.fromFile(
    engine as any,
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  );
  // One time limit for all imports of this file.
  const limits = { signal: AbortSignal.timeout(30_000), maxBlocks: 10000 };

  const frame = { x: 90, y: 90, width: 900, height: 900 };
  const { blocks, logger, dispose } = await parser.loadAsBlocks({
    units: 'scene',
    pageIndex: 0,
    preservePageBounds: true,
    ...limits
  });
  const group = blocks[0];
  if (group === undefined) {
    throw new Error('PDF page 1 is empty');
  }
  try {
    engine.block.appendChild(page, group);
    const factor = Math.min(
      frame.width / engine.block.getWidth(group),
      frame.height / engine.block.getHeight(group)
    );
    engine.block.scale(group, factor);
    engine.block.setPositionX(
      group,
      frame.x + (frame.width - engine.block.getWidth(group)) / 2
    );
    engine.block.setPositionY(
      group,
      frame.y + (frame.height - engine.block.getHeight(group)) / 2
    );
  } catch (error) {
    dispose();
    throw error;
  }

  const pageCount = await parser.getPageCount();
  // Import each PDF page on its own, so the source page number stays known.
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const result = await parser.loadAsBlocks({
      units: 'scene',
      pageIndex,
      ...limits
    });
    const pageGroup = result.blocks[0];
    if (pageGroup === undefined) {
      continue;
    }
    const newPage = engine.block.create('page');
    engine.block.setWidth(newPage, engine.block.getWidth(pageGroup));
    engine.block.setHeight(newPage, engine.block.getHeight(pageGroup));
    engine.block.appendChild(scene, newPage);
    engine.block.appendChild(newPage, pageGroup);
    engine.block.setPositionX(pageGroup, 0);
    engine.block.setPositionY(pageGroup, 0);
    engine.block.setName(newPage, `PDF page ${pageIndex + 1}`);
  }

  for (const message of logger.getMessages()) {
    if (message.type !== 'info') {
      console.warn(`[${message.code}] ${message.message}`);
    }
  }

  const outputDirectory = new URL('./output/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const png = await engine.block.export(page, { mimeType: 'image/png' });
  await writeFile(
    new URL('placed-page.png', outputDirectory),
    Buffer.from(await png.arrayBuffer())
  );
  const pdf = await engine.block.export(scene, {
    mimeType: 'application/pdf'
  });
  await writeFile(
    new URL('design.pdf', outputDirectory),
    Buffer.from(await pdf.arrayBuffer())
  );
  console.log(`Exported ${engine.scene.getPages().length} pages`);
} finally {
  engine.dispose();
}
