import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

async function promptUser(question: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    await engine.addDefaultAssetSources();

    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(sceneUrl);

    console.log('Scene loaded successfully from URL.');

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.setDropShadowEnabled(textBlocks[0], true);
      console.log('Drop shadow added to text block.');
    }

    const shouldExport = await promptUser('Export the scene to PNG? (y/n): ');
    if (shouldExport) {
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const pages = engine.block.findByType('page');
      if (pages.length > 0) {
        const blob = await engine.block.export(pages[0], {
          mimeType: 'image/png'
        });
        const buffer = Buffer.from(await blob.arrayBuffer());
        writeFileSync(`${outputDir}/scene-result.png`, buffer);
        console.log('Exported scene to output/scene-result.png');
      }
    } else {
      console.log('Export skipped.');
    }
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
