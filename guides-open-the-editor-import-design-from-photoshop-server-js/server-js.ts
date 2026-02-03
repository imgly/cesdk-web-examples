import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/psd-importer';
import {
  PSDParser,
  createPNGJSEncodeBufferToPNG,
  addGoogleFontsAssetLibrary
} from '@imgly/psd-importer';
import { PNG } from 'pngjs';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();

// Optional: Create a custom font resolver for advanced font mapping
// Use this when you need to map Photoshop fonts to specific alternatives,
// use enterprise fonts, or implement custom fallback logic
const customFontResolver: TypefaceResolver = async (fontParams, engine) => {
  const { family, style, weight } = fontParams;

  // Define font mappings from Photoshop fonts to available alternatives
  const fontMappings: Record<string, string> = {
    Arial: 'Open Sans',
    Helvetica: 'Inter',
    'Helvetica Neue': 'Inter',
    'Times New Roman': 'Lora',
    Georgia: 'Merriweather'
  };

  // Use mapped font or original family name
  const targetFamily = fontMappings[family] || family;

  // Search for the font in available typefaces
  const result = await engine.asset.findAssets('ly.img.typeface', {
    query: targetFamily,
    page: 0,
    perPage: 10
  });

  if (result.assets.length === 0) {
    console.warn(`Font "${family}" not found, using default fallback`);
    return null; // Let the parser use its default fallback
  }

  // Get the typeface from the asset payload
  const asset = result.assets[0];
  const typeface = asset.payload?.typeface;
  if (!typeface) return null;

  // Find the best matching font variant (weight and style)
  const matchingFont =
    typeface.fonts.find(
      (f: { weight?: string; style?: string }) =>
        f.weight === weight && f.style === style
    ) ||
    typeface.fonts.find((f: { weight?: string }) => f.weight === weight) ||
    typeface.fonts[0];

  return { typeface, font: matchingFont };
};

/**
 * Convert a single PSD file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertPsd(
  engine: InstanceType<typeof CreativeEngine>,
  psdPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  warnings: string[];
  errors: string[];
}> {
  // Read the PSD file
  const psdBuffer = await fs.readFile(psdPath);

  // Create parser with Node.js PNG encoder
  // The addGoogleFontsAssetLibrary() call enables automatic font matching
  // For custom font mapping, pass fontResolver in options (see customFontResolver example)
  // Note: Cast engine to any because psd-importer types expect browser engine
  const parser = await PSDParser.fromFile(
    engine as any,
    psdBuffer.buffer,
    createPNGJSEncodeBufferToPNG(PNG)
    // Optional: { fontResolver: customFontResolver } for advanced font mapping
  );

  // Parse the PSD file
  const result = await parser.parse();

  // Extract warnings and errors from logger
  const messages = result.logger.getMessages();
  const warnings = messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);
  const errors = messages
    .filter((m) => m.type === 'error')
    .map((m) => m.message);

  if (errors.length > 0) {
    console.error(`  Errors: ${errors.length}`);
  }
  if (warnings.length > 0) {
    console.warn(`  Warnings: ${warnings.length}`);
  }

  // Generate output filename from input filename
  const inputName = basename(psdPath, '.psd');
  const archivePath = join(outputDir, `${inputName}.cesdk`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, PSD images use transient buffer:// URLs that only work with saveToArchive()
  // To use saveToString(), relocate transient resources to permanent URLs first:

  // Mock upload function - replace with your actual backend upload logic
  const uploadToBackend = async (data: Uint8Array): Promise<string> => {
    // In production, upload the data to your CDN/storage and return the permanent URL
    // For this example, we write to a temp file and return a file:// URL
    const hash = data.reduce((acc, byte) => (acc + byte) % 1000000, 0);
    const tempPath = join(outputDir, `asset-${hash}.png`);
    await fs.writeFile(tempPath, data);
    return `file://${tempPath}`;
  };

  const transientResources = engine.editor.findAllTransientResources();
  for (const resource of transientResources) {
    const { URL: bufferUri, size } = resource;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data);
    engine.editor.relocateResource(bufferUri, permanentUrl);
  }

  // Now save as scene string - all URLs are permanent
  const sceneString = await engine.scene.saveToString();
  const sceneStringPath = join(outputDir, `${inputName}.scene`);
  await fs.writeFile(sceneStringPath, sceneString);

  return { archivePath, sceneStringPath, warnings, errors };
}

/**
 * Batch convert multiple PSD files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertPsds(
  psdPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${psdPaths.length} PSD files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // Note: Cast engine to any because psd-importer types expect browser engine
    await addGoogleFontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each PSD file
    for (const psdPath of psdPaths) {
      const fileName = basename(psdPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath, warnings, errors } =
          await convertPsd(engine, psdPath, outputDir);

        // Log results
        if (errors.length > 0) {
          console.log(`  Errors: ${errors.length}`);
          errors.forEach((e) => console.log(`    - ${e}`));
        }
        if (warnings.length > 0) {
          console.log(`  Warnings: ${warnings.length}`);
          warnings.forEach((w) => console.log(`    - ${w}`));
        }

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${psdPaths.length}`);
    console.log(`  Failed: ${failCount}/${psdPaths.length}`);
  } finally {
    // Always dispose engine to free resources
    engine.dispose();
  }
}

/**
 * Validate conversion results by loading the archive and checking scene structure
 */
export async function validateArchive(archivePath: string): Promise<{
  valid: boolean;
  pageCount: number;
  blockCount: number;
}> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load the archive
    const archiveBuffer = await fs.readFile(archivePath);
    const archiveBlob = new Blob([archiveBuffer]);
    const archiveUrl = URL.createObjectURL(archiveBlob);

    await engine.scene.loadFromArchiveURL(archiveUrl);

    // Get scene information
    const pages = engine.block.findByType('page');
    const allBlocks = engine.block.findAll();

    return {
      valid: pages.length > 0,
      pageCount: pages.length,
      blockCount: allBlocks.length
    };
  } finally {
    engine.dispose();
  }
}

/**
 * Find all PSD files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all PSD files in directory
  const files = await fs.readdir(inputDir);
  const psdFiles = files
    .filter((f) => f.toLowerCase().endsWith('.psd'))
    .map((f) => join(inputDir, f));

  if (psdFiles.length === 0) {
    console.log(`No PSD files found in ${inputDir}`);
    return;
  }

  await batchConvertPsds(psdFiles, outputDir);
}

/**
 * Main entry point - demonstrates batch PSD conversion workflow
 */
async function main(): Promise<void> {
  console.log('PSD to CE.SDK Batch Converter');
  console.log('=============================\n');

  // Example: Convert a single PSD file
  // In production, you would provide actual PSD files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGoogleFontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual PSD conversion
    await engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(engine.scene.get()!, page);

    // Save as archive
    await fs.mkdir('./output', { recursive: true });
    const archive = await engine.scene.saveToArchive();
    const archiveBuffer = Buffer.from(await archive.arrayBuffer());
    await fs.writeFile('./output/sample.cesdk', archiveBuffer);

    console.log('Sample archive created: ./output/sample.cesdk');
    console.log('\nTo convert actual PSD files:');
    console.log('1. Place PSD files in an input directory');
    console.log('2. Call: await processDirectory("./input", "./output")');
  } finally {
    engine.dispose();
  }
}

// Run the example
main().catch(console.error);
