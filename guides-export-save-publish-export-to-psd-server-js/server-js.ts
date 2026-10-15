import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';

import { exportPsd } from '@imgly/psd-exporter';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  await engine.scene.load(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
    false,
    true
  );
  const outputDir = new URL('./output/', import.meta.url);
  await mkdir(outputDir, { recursive: true });

  const pages = engine.scene.getPages();
  for (const [index, page] of pages.entries()) {
    const preview = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    await writeFile(
      new URL(`page-${index + 1}-source.png`, outputDir),
      new Uint8Array(await preview.arrayBuffer())
    );
  }

  console.log('Exporting PSD files...');
  const { psds, logger } = await exportPsd(engine);

  const outputs = [];
  for (const [index, { pageName, psd }] of psds.entries()) {
    const filename = `page-${index + 1}.psd`;
    await writeFile(new URL(filename, outputDir), psd);
    outputs.push({ pageName, filename });
    console.log(`Saved ${filename} (${pageName})`);
  }

  const messages = logger.getMessages();
  await writeFile(
    new URL('export-report.json', outputDir),
    JSON.stringify({ outputs, messages }, null, 2)
  );
  for (const message of messages) {
    console.warn(`${message.type}: ${message.code} — ${message.message}`);
  }

  console.log(`Export files: ${outputDir.pathname}`);
  console.log('The source PNGs show CE.SDK rendering, not PSD rendering.');
} finally {
  engine.dispose();
}
