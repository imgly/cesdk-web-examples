import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

config();

const OUTPUT_DIR = './output';

async function promptChoice(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n┌───────────────────────────────────┐');
  console.log('│   JPEG Export Options             │');
  console.log('├───────────────────────────────────┤');
  console.log('│   1. Standard (quality: 0.9)      │');
  console.log('│   2. High Quality (quality: 1.0)  │');
  console.log('│   3. HD (1920×1080)               │');
  console.log('└───────────────────────────────────┘\n');

  return new Promise((resolve) => {
    rl.question('Select option (1-3): ', (answer) => {
      rl.close();
      resolve(answer.trim());
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
  const choice = await promptChoice();

  let done = showProgress('Loading scene...');
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );
  done();

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  done = showProgress('Exporting JPEG...');

  let blob: Blob;
  let filename: string;

  switch (choice) {
    case '2':
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 1.0
      });
      filename = 'high-quality.jpg';
      break;

    case '3':
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        targetWidth: 1920,
        targetHeight: 1080
      });
      filename = 'hd-1920x1080.jpg';
      break;

    default:
      blob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      filename = 'standard.jpg';
  }

  done();

  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${OUTPUT_DIR}/${filename}`, buffer);

  console.log(`\n✓ Saved: ${OUTPUT_DIR}/${filename}`);
  console.log(`  Size: ${(blob.size / 1024).toFixed(1)} KB\n`);
} finally {
  engine.dispose();
}
