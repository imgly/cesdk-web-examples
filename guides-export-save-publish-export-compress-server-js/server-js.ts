import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

config();

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
console.log('=== Compression Export Options ===\n');
console.log('1. PNG with compression levels');
console.log('2. JPEG with quality settings');
console.log('3. WebP with quality settings');
console.log('4. All formats\n');

const choice = (await prompt('Select export option (1-4): ')) || '4';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.block.findByType('page')[0];
  if (page == null) throw new Error('No page found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '4') {
    const pngBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      pngCompressionLevel: 9
    });
    const buffer = Buffer.from(await pngBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.png`, buffer);
    console.log(
      `✓ PNG (level 9): ${outputDir}/compressed.png (${(pngBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '4') {
    const jpegBlob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      jpegQuality: 0.8
    });
    const buffer = Buffer.from(await jpegBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.jpg`, buffer);
    console.log(
      `✓ JPEG (quality 0.8): ${outputDir}/compressed.jpg (${(jpegBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '4') {
    const webpBlob = await engine.block.export(page, {
      mimeType: 'image/webp',
      webpQuality: 0.8
    });
    const buffer = Buffer.from(await webpBlob.arrayBuffer());
    writeFileSync(`${outputDir}/compressed.webp`, buffer);
    console.log(
      `✓ WebP (quality 0.8): ${outputDir}/compressed.webp (${(webpBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4') {
    const scaledBlob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1200,
      targetHeight: 630
    });
    const buffer = Buffer.from(await scaledBlob.arrayBuffer());
    writeFileSync(`${outputDir}/scaled.png`, buffer);
    console.log(
      `✓ Scaled (1200x630): ${outputDir}/scaled.png (${(scaledBlob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
