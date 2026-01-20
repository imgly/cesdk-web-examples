import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

config();

// Helper function to prompt for user input
function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Display export options menu
console.log('=== PNG Export Options ===\n');
console.log('1. Default PNG (balanced compression)');
console.log('2. Maximum compression (smaller file)');
console.log('3. HD export (1920x1080)');
console.log('4. All formats\n');

const choice = (await prompt('Select export option (1-4): ')) || '4';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (!page) throw new Error('No page found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design.png`, buffer);
    console.log(
      `✓ Default PNG: ${outputDir}/design.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-compressed.png`, buffer);
    console.log(
      `✓ Compressed PNG: ${outputDir}/design-compressed.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '4') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1920,
      targetHeight: 1080
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-hd.png`, buffer);
    console.log(
      `✓ HD PNG: ${outputDir}/design-hd.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
