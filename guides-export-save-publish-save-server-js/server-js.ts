import CreativeEngine from '@cesdk/node';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';
import path from 'path';

config();

/**
 * CE.SDK Server Guide: Save Designs
 *
 * Demonstrates how to save and serialize designs:
 * - Saving scenes to string format for database storage
 * - Saving scenes to archive format with embedded assets
 * - Loading saved content back into the engine
 */

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

console.log('\n=== CE.SDK Save Designs ===\n');
console.log('Select save format:');
console.log('  1. String (for database storage)');
console.log('  2. Archive (self-contained ZIP)');
console.log('  3. Both formats\n');

const choice = await prompt('Enter choice (1/2/3): ');

const saveString =
  choice === '1' || choice === '3' || !['1', '2', '3'].includes(choice);
const saveArchive =
  choice === '2' || choice === '3' || !['1', '2', '3'].includes(choice);

if (!['1', '2', '3'].includes(choice)) {
  console.log('Invalid choice. Defaulting to both formats.\n');
}

console.log('⏳ Initializing Creative Engine...');

const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE
});

try {
  console.log('⏳ Loading template scene...');

  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const page = engine.scene.getCurrentPage();
  if (page == null) {
    throw new Error('No page found in scene');
  }

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('✅ Scene loaded\n');

  if (saveString) {
    console.log('⏳ Saving to string...');
    const sceneString = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/scene.scene`, sceneString);
    console.log(
      `✅ Scene saved: output/scene.scene (${(sceneString.length / 1024).toFixed(1)} KB)`
    );
  }

  if (saveArchive) {
    console.log('⏳ Saving to archive...');
    const archiveBlob = await engine.scene.saveToArchive();
    const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
    writeFileSync(`${outputDir}/scene.zip`, archiveBuffer);
    console.log(
      `✅ Archive saved: output/scene.zip (${(archiveBuffer.length / 1024).toFixed(1)} KB)`
    );
  }

  if (saveString) {
    console.log('\n⏳ Loading from saved scene file...');
    const sceneString = readFileSync(`${outputDir}/scene.scene`, 'utf-8');
    await engine.scene.loadFromString(sceneString);
    console.log('✅ Scene loaded from file');
  }

  if (saveArchive) {
    console.log('⏳ Loading from saved archive...');
    const archivePath = path.resolve(`${outputDir}/scene.zip`);
    const archiveFileUrl = `file://${archivePath}`;
    await engine.scene.loadFromArchiveURL(archiveFileUrl);
    console.log('✅ Scene loaded from archive');
  }

  console.log('\n🎉 Complete! Files saved to:', outputDir);
} finally {
  engine.dispose();
}
