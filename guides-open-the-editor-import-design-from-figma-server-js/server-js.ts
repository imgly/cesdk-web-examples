import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { importFig, importFigmaFile } from '@imgly/figma-importer';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  const selectedCanvas = process.env.FIGMA_CANVAS ?? '0';
  const options = {
    canvas: /^\d+$/.test(selectedCanvas)
      ? Number(selectedCanvas)
      : selectedCanvas,
    preserveFigmaData: process.env.PRESERVE_FIGMA_DATA !== 'false'
  };

  const importLocal = async () => {
    const input =
      process.env.FIGMA_INPUT ??
      new URL('./assets/sample.fig', import.meta.url);
    const bytes = await readFile(input);
    return importFig(engine, bytes, options);
  };

  const importRest = async (fileKey: string) => {
    return importFigmaFile(engine, {
      fileKey,
      token: process.env.FIGMA_TOKEN,
      ...options
    });
  };

  const fileKey = process.env.FIGMA_FILE_KEY;
  const result = fileKey ? await importRest(fileKey) : await importLocal();

  const outputDir = new URL('./output/', import.meta.url);
  await mkdir(outputDir, { recursive: true });
  const messages = result.logger.getMessages();
  console.log('Loaded canvas:', result.canvas);
  console.log('Available canvases:', result.canvases);
  for (const message of messages) {
    console.warn(`${message.type}: ${message.code} — ${message.message}`);
  }
  await writeFile(
    new URL('import-report.json', outputDir),
    JSON.stringify(
      { canvas: result.canvas, canvases: result.canvases, messages },
      null,
      2
    )
  );

  await engine.block.forceLoadResources([result.scene]);
  const archive = await engine.scene.saveToArchive();
  await writeFile(
    new URL('design.imgly', outputDir),
    new Uint8Array(await archive.arrayBuffer())
  );
  console.log(`Archive and report: ${outputDir.pathname}`);
} finally {
  engine.dispose();
}
