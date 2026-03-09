import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * Custom logger that prefixes messages with timestamp and level
 */
function createLogger(prefix: string) {
  return (message: string, level = 'Info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${prefix}] [${level}] ${message}`);
  };
}

// License key removes watermarks from exports
// Get a free trial at https://img.ly/forms/free-trial
const license = process.env.CESDK_LICENSE ?? '';

// Location of core engine assets (WASM, data files)
// For production, host assets yourself instead of using the IMG.LY CDN:
// const baseURL = 'https://your-cdn.com/cesdk-assets/';

// User ID for accurate MAU tracking
const userId = 'server-process-' + process.pid;

/**
 * Configuration for CreativeEngine.init()
 */
const initConfig = {
  license,
  userId,
  logger: createLogger('CE.SDK')
};

/**
 * Demonstrate runtime settings
 */
function demonstrateRuntimeSettings(engine: CreativeEngine): void {
  console.log('\n=== Runtime Settings ===\n');

  // Configure engine settings using setSetting/getSetting
  engine.editor.setSetting('doubleClickToCropEnabled', false);
  const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
  console.log(`doubleClickToCropEnabled: ${cropEnabled}`);

  engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
  const highlightColor = engine.editor.getSetting('highlightColor');
  console.log(`highlightColor: ${JSON.stringify(highlightColor)}`);
}

/**
 * Export the result to output directory
 */
async function exportResult(
  engine: CreativeEngine,
  page: number
): Promise<string> {
  // Create output directory
  if (!existsSync('output')) {
    mkdirSync('output', { recursive: true });
  }

  // Export as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = 'output/configuration-demo.png';
  writeFileSync(outputPath, buffer);
  console.log(`\nExported to ${outputPath}`);

  return outputPath;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init(initConfig);

try {
  console.log('=== CE.SDK Server Configuration Demo ===\n');

  // Create a scene
  console.log('Creating scene...');
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];
  console.log('Scene created (800x600)\n');

  // Create gradient background (matching browser example)
  const gradientFill = engine.block.createFill('gradient/linear');
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { r: 0.15, g: 0.1, b: 0.35, a: 1.0 }, stop: 0 },
    { color: { r: 0.4, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
    { color: { r: 0.6, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
  ]);
  engine.block.setFill(page, gradientFill);
  console.log('Gradient background applied');

  // Add centered title text
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  const titleText = engine.block.create('text');
  engine.block.replaceText(titleText, 'Configure your Editor');
  engine.block.setFloat(titleText, 'text/fontSize', 12);
  engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
  engine.block.setWidthMode(titleText, 'Auto');
  engine.block.setHeightMode(titleText, 'Auto');
  engine.block.appendChild(page, titleText);

  // Add IMG.LY subtext
  const subtitleText = engine.block.create('text');
  engine.block.replaceText(subtitleText, 'Powered by IMG.LY');
  engine.block.setFloat(subtitleText, 'text/fontSize', 6);
  engine.block.setTextColor(subtitleText, { r: 0.9, g: 0.9, b: 0.9, a: 0.8 });
  engine.block.setWidthMode(subtitleText, 'Auto');
  engine.block.setHeightMode(subtitleText, 'Auto');
  engine.block.appendChild(page, subtitleText);

  // Center both texts
  const titleWidth = engine.block.getFrameWidth(titleText);
  const titleHeight = engine.block.getFrameHeight(titleText);
  const subtitleWidth = engine.block.getFrameWidth(subtitleText);
  const subtitleHeight = engine.block.getFrameHeight(subtitleText);

  const spacing = 12;
  const totalHeight = titleHeight + spacing + subtitleHeight;
  const startY = (pageHeight - totalHeight) / 2;

  engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleText, startY);
  engine.block.setPositionX(subtitleText, (pageWidth - subtitleWidth) / 2);
  engine.block.setPositionY(subtitleText, startY + titleHeight + spacing);
  console.log('Title and subtitle added');

  // Demonstrate runtime settings
  demonstrateRuntimeSettings(engine);

  // Export result
  await exportResult(engine, page);

  console.log('\nDemo complete!');
} finally {
  // Clean up engine resources
  engine.dispose();
  console.log('Engine disposed');
}
