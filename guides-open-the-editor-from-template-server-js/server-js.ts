import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __dirname = dirname(fileURLToPath(import.meta.url));

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

    const templateUrl =
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(templateUrl);

    console.log('Template loaded successfully.');

    // Load scene from string (file read)
    const sceneFilePath = join(__dirname, 'assets', 'business-card.scene');
    const sceneString = readFileSync(sceneFilePath, 'utf-8');
    await engine.scene.loadFromString(sceneString);

    console.log('Scene loaded from string.');

    const textBlocks = engine.block.findByType('text');
    if (textBlocks.length > 0) {
      engine.block.replaceText(textBlocks[0], 'Welcome to CE.SDK');
    }

    const shouldExport = await promptUser(
      'Export the template to PNG? (y/n): '
    );
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
        writeFileSync(`${outputDir}/template-result.png`, buffer);
        console.log('Exported template to output/template-result.png');
      }
    } else {
      console.log('Export skipped.');
    }
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
