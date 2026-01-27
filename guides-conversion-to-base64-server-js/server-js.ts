import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

const OUTPUT_DIR = './output';

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function showProgress(msg: string): () => void {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write(`${frames[0]} ${msg}`);
  const id = setInterval(() => {
    i = (i + 1) % frames.length;
    process.stdout.write(`\r${frames[i]} ${msg}`);
  }, 80);
  return () => {
    clearInterval(id);
    process.stdout.write(`\r✓ ${msg}\n`);
  };
}

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  let done = showProgress('Loading scene...');
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  done();

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  console.log('\n┌───────────────────────────────────┐');
  console.log('│   Convert to Base64               │');
  console.log('├───────────────────────────────────┤');
  console.log('│   Scene loaded successfully.      │');
  console.log('│   Ready to export as PNG Base64.  │');
  console.log('└───────────────────────────────────┘\n');

  const confirm = await prompt('Export to Base64? (y/n): ');
  if (confirm !== 'y' && confirm !== 'yes') {
    console.log('\nExport cancelled.\n');
    process.exit(0);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  done = showProgress('Exporting to Base64...');

  const blob = await engine.block.export(page, {
    mimeType: 'image/png'
  });

  done();

  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = buffer.toString('base64');
  const dataUri = `data:${blob.type};base64,${base64}`;

  writeFileSync(`${OUTPUT_DIR}/export.png`, buffer);
  writeFileSync(`${OUTPUT_DIR}/base64.txt`, dataUri);

  console.log(`\n✓ Saved: ${OUTPUT_DIR}/export.png`);
  console.log(`✓ Saved: ${OUTPUT_DIR}/base64.txt`);
  console.log(`  Binary: ${(blob.size / 1024).toFixed(1)} KB`);
  console.log(
    `  Base64: ${(dataUri.length / 1024).toFixed(1)} KB (~33% overhead)\n`
  );
} finally {
  engine.dispose();
}
