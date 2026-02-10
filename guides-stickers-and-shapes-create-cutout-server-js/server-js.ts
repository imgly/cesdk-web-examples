import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Cutout
 *
 * Demonstrates creating cutout paths for cutting printers in Node.js:
 * - Creating cutouts from SVG paths
 * - Configuring cutout types (Solid/Dashed)
 * - Setting cutout offset distance
 * - Combining cutouts with boolean operations
 * - Customizing spot colors
 * - Exporting to PDF for cutting printers
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a circular cutout from SVG path (scaled up for visibility)
  const circle = engine.block.createCutoutFromPath(
    'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
  );
  engine.block.appendChild(page, circle);
  engine.block.setPositionX(circle, 200);
  engine.block.setPositionY(circle, 225);

  // Set cutout type to Dashed for perforated cut line
  engine.block.setEnum(circle, 'cutout/type', 'Dashed');

  // Set cutout offset distance from source path
  engine.block.setFloat(circle, 'cutout/offset', 5.0);

  // Create a square cutout with solid type (scaled up for visibility)
  const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
  engine.block.appendChild(page, square);
  engine.block.setPositionX(square, 450);
  engine.block.setPositionY(square, 225);
  engine.block.setFloat(square, 'cutout/offset', 8.0);

  // Combine cutouts using Union operation
  const combined = engine.block.createCutoutFromOperation(
    [circle, square],
    'Union'
  );
  engine.block.appendChild(page, combined);
  engine.block.setPositionX(combined, 200);
  engine.block.setPositionY(combined, 225);

  // Destroy original cutouts to avoid duplicate cuts
  engine.block.destroy(circle);
  engine.block.destroy(square);

  // Customize spot color RGB for rendering (bright blue for visibility)
  engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);

  // Export to PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.png`, pngBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PNG preview to output/cutout-result.png');

  // Export to PDF with spot colors for cutting printer
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cutout-result.pdf`, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported PDF with spot colors to output/cutout-result.pdf');

  // eslint-disable-next-line no-console
  console.log('\n✓ Cutout creation completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
