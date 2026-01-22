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

// Display thumbnail options menu
console.log('=== Thumbnail Generation Options ===\n');
console.log('1. Small thumbnail (150×150 JPEG)');
console.log('2. Medium thumbnail (400×300 JPEG)');
console.log('3. PNG thumbnail (400×300)');
console.log('4. WebP thumbnail (400×300)');
console.log('5. All formats\n');

const choice = (await prompt('Select thumbnail option (1-5): ')) || '5';

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

  console.log('⏳ Generating thumbnails...\n');

  if (choice === '1' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      targetWidth: 150,
      targetHeight: 150,
      jpegQuality: 0.8
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail-small.jpg`, buffer);
    console.log(
      `✓ Small thumbnail: ${outputDir}/thumbnail-small.jpg (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/jpeg',
      targetWidth: 400,
      targetHeight: 300,
      jpegQuality: 0.85
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail-medium.jpg`, buffer);
    console.log(
      `✓ Medium thumbnail: ${outputDir}/thumbnail-medium.jpg (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 300,
      pngCompressionLevel: 6
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail.png`, buffer);
    console.log(
      `✓ PNG thumbnail: ${outputDir}/thumbnail.png (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4' || choice === '5') {
    const blob = await engine.block.export(page, {
      mimeType: 'image/webp',
      targetWidth: 400,
      targetHeight: 300,
      webpQuality: 0.8
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/thumbnail.webp`, buffer);
    console.log(
      `✓ WebP thumbnail: ${outputDir}/thumbnail.webp (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Thumbnail generation completed');
} finally {
  engine.dispose();
}
