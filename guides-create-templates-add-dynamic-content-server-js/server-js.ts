import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Dynamic Content Overview
 *
 * Demonstrates the dynamic content capabilities in CE.SDK templates:
 * - Text Variables: Insert {{tokens}} that resolve to dynamic values
 * - Placeholders: Create drop zones for swappable images/videos
 * - Editing Constraints: Lock properties while allowing controlled changes
 * - Exporting personalized designs to PNG
 */

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

// Gather user input for personalization
console.log('=== Dynamic Content Generator ===\n');

const firstName =
  (await prompt('Enter first name (default: Jane): ')) || 'Jane';
const lastName = (await prompt('Enter last name (default: Doe): ')) || 'Doe';
const companyName =
  (await prompt('Enter company name (default: IMG.LY): ')) || 'IMG.LY';
const heroImageUrl =
  (await prompt('Enter hero image URL (default: sample image): ')) ||
  'https://img.ly/static/ubq_samples/sample_1.jpg';

console.log('\nGenerating design with:');
console.log(`  First Name: ${firstName}`);
console.log(`  Last Name: ${lastName}`);
console.log(`  Company: ${companyName}`);
console.log(`  Hero Image: ${heroImageUrl}\n`);

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with free positioning
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setFloat(scene, 'scene/dpi', 30);
  engine.block.appendChild(scene, page);
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);

  // Content area: 480px wide, centered (left margin = 160px)
  const contentX = 160;
  const contentWidth = 480;

  // TEXT VARIABLES: Define variables from user input
  engine.variable.setString('firstName', firstName);
  engine.variable.setString('lastName', lastName);
  engine.variable.setString('companyName', companyName);

  // Create heading with company variable
  const headingText = engine.block.create('text');
  engine.block.replaceText(
    headingText,
    'Welcome to {{companyName}}, {{firstName}} {{lastName}}.'
  );
  engine.block.appendChild(page, headingText);
  engine.block.setPositionX(headingText, contentX);
  engine.block.setPositionY(headingText, 200);
  engine.block.setWidth(headingText, contentWidth);
  engine.block.setHeightMode(headingText, 'Auto');
  engine.block.setTextColor(headingText, { r: 0.1, g: 0.1, b: 0.1, a: 1.0 });
  engine.block.setFloat(headingText, 'text/fontSize', 64);

  // Create description with bullet points
  const descriptionText = engine.block.create('text');
  engine.block.appendChild(page, descriptionText);
  engine.block.setPositionX(descriptionText, contentX);
  engine.block.setPositionY(descriptionText, 300);
  engine.block.setWidth(descriptionText, contentWidth);
  engine.block.setHeightMode(descriptionText, 'Auto');
  engine.block.replaceText(
    descriptionText,
    'This example demonstrates dynamic templates.\n\n' +
      '• Text Variables — Personalize content with {{tokens}}\n' +
      '• Placeholders — Swappable images and media\n' +
      '• Editing Constraints — Protected brand elements'
  );
  engine.block.setTextColor(descriptionText, {
    r: 0.2,
    g: 0.2,
    b: 0.2,
    a: 1.0
  });
  engine.block.setFloat(descriptionText, 'text/fontSize', 44);

  // Discover all variables in the scene
  const allVariables = engine.variable.findAll();
  console.log('Variables in scene:', allVariables);

  // PLACEHOLDERS: Create hero image from user-provided URL
  const heroImage = await engine.block.addImage(heroImageUrl, {
    size: { width: contentWidth, height: 140 }
  });
  engine.block.appendChild(page, heroImage);
  engine.block.setPositionX(heroImage, contentX);
  engine.block.setPositionY(heroImage, 40);
  engine.block.setWidth(heroImage, contentWidth);
  engine.block.setHeight(heroImage, 140);

  // Enable placeholder behavior for the hero image
  if (engine.block.supportsPlaceholderBehavior(heroImage)) {
    engine.block.setPlaceholderBehaviorEnabled(heroImage, true);
    engine.block.setPlaceholderEnabled(heroImage, true);

    if (engine.block.supportsPlaceholderControls(heroImage)) {
      engine.block.setPlaceholderControlsOverlayEnabled(heroImage, true);
      engine.block.setPlaceholderControlsButtonEnabled(heroImage, true);
    }
  }

  // Find all placeholders in the scene
  const placeholders = engine.block.findAllPlaceholders();
  console.log('Placeholders in scene:', placeholders.length);

  // EDITING CONSTRAINTS: Add logo that cannot be moved or selected
  const logo = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/imgly_logo.jpg',
    { size: { width: 100, height: 25 } }
  );
  engine.block.appendChild(page, logo);
  engine.block.setPositionX(logo, 350);
  engine.block.setPositionY(logo, 540);
  engine.block.setWidth(logo, 100);
  engine.block.setHeight(logo, 25);

  // Lock the logo: prevent moving, resizing, and selection
  engine.block.setScopeEnabled(logo, 'layer/move', false);
  engine.block.setScopeEnabled(logo, 'layer/resize', false);
  engine.block.setScopeEnabled(logo, 'editor/select', false);

  // Verify constraints are applied
  const canSelect = engine.block.isScopeEnabled(logo, 'editor/select');
  const canMove = engine.block.isScopeEnabled(logo, 'layer/move');
  console.log('Logo - canSelect:', canSelect, 'canMove:', canMove);

  // Export the personalized design to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = `${outputDir}/welcome-${firstName.toLowerCase()}-${lastName.toLowerCase()}.png`;
  writeFileSync(outputPath, buffer);

  console.log(`\n✓ Exported result to ${outputPath}`);

  console.log('\nDynamic Content generation completed.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
