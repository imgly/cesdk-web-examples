import CreativeEngine from '@cesdk/node';
import type { TypefaceResolver } from '@imgly/idml-importer';
import { IDMLParser, addGoogleFontsAssetLibrary } from '@imgly/idml-importer';
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { join, basename } from 'path';

// Load environment variables
config();

// Optional: Create a custom font resolver for advanced font mapping
// Use this when you need to map InDesign fonts to specific alternatives,
// use enterprise fonts, or implement custom fallback logic
const customFontResolver: TypefaceResolver = async (fontParams, engine) => {
  const { family, style, weight } = fontParams;

  // Define font mappings from InDesign fonts to available alternatives
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
 * Convert a single IDML file to CE.SDK scene formats
 * Outputs both an archive file and a scene string with stable URLs
 */
async function convertIdml(
  engine: InstanceType<typeof CreativeEngine>,
  idmlPath: string,
  outputDir: string
): Promise<{
  archivePath: string;
  sceneStringPath: string;
  pageCount: number;
}> {
  // Read the IDML file
  const idmlBuffer = await fs.readFile(idmlPath);

  // Parse the IDML file using JSDOM for XML parsing
  // Server-side import requires JSDOM since DOMParser is browser-only
  // The addGoogleFontsAssetLibrary() call enables automatic font matching
  // For custom font mapping, pass fontResolver as 4th parameter (see customFontResolver example)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = await IDMLParser.fromFile(
    engine as any,
    idmlBuffer.buffer,
    (content: string) =>
      new JSDOM(content, {
        contentType: 'text/xml',
        storageQuota: 10000000,
        url: 'http://localhost'
      }).window.document
    // Optional: customFontResolver for advanced font mapping
  );
  await parser.parse();

  // Verify pages were imported successfully
  const pages = engine.scene.getPages();
  if (pages.length === 0) {
    throw new Error(`No pages imported from IDML file: ${idmlPath}`);
  }
  console.log(`  Imported ${pages.length} page(s)`);

  // Generate output filename from input filename
  const inputName = basename(idmlPath, '.idml');
  const archivePath = join(outputDir, `${inputName}.cesdk`);

  // Save as scene archive
  const archive = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archive.arrayBuffer());
  await fs.writeFile(archivePath, archiveBuffer);

  // Optional: Save scene as JSON string with stable URLs instead of archive
  // This is useful when storing scenes in a database or referencing CDN-hosted assets
  // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
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

  return { archivePath, sceneStringPath, pageCount: pages.length };
}

/**
 * Batch convert multiple IDML files to CE.SDK scene formats
 * Processes files sequentially, continuing even if individual files fail
 */
async function batchConvertIdmls(
  idmlPaths: string[],
  outputDir: string
): Promise<void> {
  console.log(`Starting batch conversion of ${idmlPaths.length} IDML files...`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize engine once for all conversions
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await addGoogleFontsAssetLibrary(engine as any);

    let successCount = 0;
    let failCount = 0;

    // Process each IDML file
    for (const idmlPath of idmlPaths) {
      const fileName = basename(idmlPath);
      console.log(`\nProcessing: ${fileName}`);

      try {
        const { archivePath, sceneStringPath } = await convertIdml(
          engine,
          idmlPath,
          outputDir
        );

        console.log(`  Archive: ${archivePath}`);
        console.log(`  Scene:   ${sceneStringPath}`);
        successCount++;
      } catch (error) {
        console.error(`  Failed: ${(error as Error).message}`);
        failCount++;
      }
    }

    console.log(`\nBatch conversion complete:`);
    console.log(`  Success: ${successCount}/${idmlPaths.length}`);
    console.log(`  Failed: ${failCount}/${idmlPaths.length}`);
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
 * Find all IDML files in a directory and convert them
 */
export async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Find all IDML files in directory
  const files = await fs.readdir(inputDir);
  const idmlFiles = files
    .filter((f) => f.toLowerCase().endsWith('.idml'))
    .map((f) => join(inputDir, f));

  if (idmlFiles.length === 0) {
    console.log(`No IDML files found in ${inputDir}`);
    return;
  }

  await batchConvertIdmls(idmlFiles, outputDir);
}

/**
 * Main entry point - demonstrates batch IDML conversion workflow
 */
async function main(): Promise<void> {
  console.log('IDML to CE.SDK Batch Converter');
  console.log('==============================\n');

  // Example: Convert a single IDML file
  // In production, you would provide actual IDML files
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Configure Google Fonts for text element support
    await addGoogleFontsAssetLibrary(engine as any);

    // Create a sample scene to demonstrate the export format
    // In production, this would be replaced by actual IDML conversion
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
    console.log('\nTo convert actual IDML files:');
    console.log('1. Place IDML files in an input directory');
    console.log('2. Call: await processDirectory("./input", "./output")');
  } finally {
    engine.dispose();
  }
}

// Run the example
main().catch(console.error);
