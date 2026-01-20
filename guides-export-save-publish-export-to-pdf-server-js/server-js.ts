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
console.log('=== PDF Export Options ===\n');
console.log('1. Default PDF');
console.log('2. High Compatibility PDF');
console.log('3. PDF with Underlayer');
console.log('4. A4 @ 300 DPI PDF');
console.log('5. All formats\n');

const choice = (await prompt('Select export option (1-5): ')) || '5';

console.log('\n⏳ Initializing engine...');

const engine = await CreativeEngine.init({
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  await engine.addDefaultAssetSources();
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Get the scene block for PDF export (includes all pages)
  const scene = engine.scene.get();
  if (!scene) throw new Error('No scene found');

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('⏳ Exporting...\n');

  if (choice === '1' || choice === '5') {
    // Export scene as PDF (includes all pages)
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design.pdf`, buffer);
    console.log(
      `✓ Default PDF: ${outputDir}/design.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '2' || choice === '5') {
    // Enable high compatibility mode for consistent rendering across PDF viewers
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-high-compatibility.pdf`, buffer);
    console.log(
      `✓ High Compatibility PDF: ${outputDir}/design-high-compatibility.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '3' || choice === '5') {
    engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

    // Export with underlayer for special media printing
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      underlayerOffset: -2.0
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-with-underlayer.pdf`, buffer);
    console.log(
      `✓ PDF with Underlayer: ${outputDir}/design-with-underlayer.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  if (choice === '4' || choice === '5') {
    // Export with specific dimensions for print output
    const blob = await engine.block.export(scene, {
      mimeType: 'application/pdf',
      targetWidth: 2480,
      targetHeight: 3508
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/design-a4.pdf`, buffer);
    console.log(
      `✓ A4 PDF: ${outputDir}/design-a4.pdf (${(blob.size / 1024).toFixed(1)} KB)`
    );
  }

  console.log('\n✓ Export completed');
} finally {
  engine.dispose();
}
