import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { exportFig } from '@imgly/figma-exporter';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  const archivePath = process.env.FIGMA_SOURCE_ARCHIVE;
  if (archivePath) {
    const bytes = await readFile(archivePath);
    await engine.scene.loadFromArchiveURL(
      `data:application/zip;base64,${bytes.toString('base64')}`,
      false,
      true
    );
  } else {
    const scene = engine.scene.create();
    engine.block.setName(scene, 'Two-page design');
    for (let index = 0; index < 2; index++) {
      const page = engine.block.create('page');
      engine.block.setName(page, `Page ${index + 1}`);
      engine.block.setWidth(page, 600);
      engine.block.setHeight(page, 400);
      engine.block.appendChild(scene, page);

      const graphic = engine.block.create('graphic');
      engine.block.setName(graphic, `Rectangle ${index + 1}`);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      const fill = engine.block.createFill('color');
      engine.block.setColor(fill, 'fill/color/value', {
        r: index === 0 ? 0.2 : 0.9,
        g: 0.4,
        b: index === 0 ? 0.8 : 0.2,
        a: 1
      });
      engine.block.setFill(graphic, fill);
      engine.block.setWidth(graphic, 400);
      engine.block.setHeight(graphic, 200);
      engine.block.setPositionX(graphic, 100);
      engine.block.setPositionY(graphic, 100);
      engine.block.appendChild(page, graphic);
    }
  }

  const outputDir = new URL('./output/', import.meta.url);
  await mkdir(outputDir, { recursive: true });
  for (const [index, page] of engine.scene.getPages().entries()) {
    const preview = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    await writeFile(
      new URL(`page-${index + 1}-source.png`, outputDir),
      new Uint8Array(await preview.arrayBuffer())
    );
  }

  const { fig, logger } = await exportFig(engine, {
    fileName: 'CE.SDK design'
  });
  await writeFile(new URL('design.fig', outputDir), fig);

  const messages = logger.getMessages();
  await writeFile(
    new URL('export-report.json', outputDir),
    JSON.stringify({ messages }, null, 2)
  );
  for (const message of messages) {
    console.warn(`${message.type}: ${message.code} — ${message.message}`);
  }
  console.log(`Figma file, source previews, and report: ${outputDir.pathname}`);
} finally {
  engine.dispose();
}
