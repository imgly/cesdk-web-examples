import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Variables
 *
 * Demonstrates text variable management in headless Node.js environment:
 * - Discovering variables with findAll()
 * - Creating and updating variables with setString()
 * - Reading variable values with getString()
 * - Binding variables to text blocks with {{variable}} tokens
 * - Detecting variable references with referencesAnyVariables()
 * - Removing variables with remove()
 * - Exporting personalized designs to PNG
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } },
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Discover all existing variables in the scene
  // This is useful when loading templates to see what variables need values
  const existingVariables = engine.variable.findAll();
  // eslint-disable-next-line no-console
  console.log('Existing variables:', existingVariables); // []

  // Create and update text variables
  // If a variable doesn't exist, setString() creates it
  // If it already exists, setString() updates its value
  engine.variable.setString('firstName', 'Alex');
  engine.variable.setString('lastName', 'Smith');
  engine.variable.setString('email', 'alex.smith@example.com');
  engine.variable.setString('company', 'IMG.LY');
  engine.variable.setString('title', 'Creative Developer');

  // Read variable values at runtime
  const firstName = engine.variable.getString('firstName');
  // eslint-disable-next-line no-console
  console.log('First name variable:', firstName); // 'Alex'

  // Create a text block demonstrating variable binding patterns
  const textBlock = engine.block.create('text');

  // Multi-line text combining:
  // - Single variable ({{firstName}})
  // - Multiple variables ({{firstName}} {{lastName}})
  // - Variables in context (Email: {{email}})
  const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

  engine.block.replaceText(textBlock, textContent);
  engine.block.setWidthMode(textBlock, 'Auto');
  engine.block.setHeightMode(textBlock, 'Auto');
  engine.block.setFloat(textBlock, 'text/fontSize', 24);
  engine.block.appendChild(page, textBlock);

  // Center the text block on the page
  const frameX = engine.block.getFrameX(textBlock);
  const frameY = engine.block.getFrameY(textBlock);
  const frameWidth = engine.block.getFrameWidth(textBlock);
  const frameHeight = engine.block.getFrameHeight(textBlock);

  engine.block.setPositionX(textBlock, (pageWidth - frameWidth) / 2 - frameX);
  engine.block.setPositionY(textBlock, (pageHeight - frameHeight) / 2 - frameY);

  // Check if the block contains variable references
  const hasVariables = engine.block.referencesAnyVariables(textBlock);
  // eslint-disable-next-line no-console
  console.log('Text block has variables:', hasVariables); // true

  // Create and then remove a temporary variable to demonstrate removal
  engine.variable.setString('tempVariable', 'Temporary Value');
  // eslint-disable-next-line no-console
  console.log('Variables before removal:', engine.variable.findAll());

  // Remove the temporary variable
  engine.variable.remove('tempVariable');
  // eslint-disable-next-line no-console
  console.log('Variables after removal:', engine.variable.findAll());

  // Final check: List all variables in the scene
  const finalVariables = engine.variable.findAll();
  // eslint-disable-next-line no-console
  console.log('Final variables in scene:', finalVariables);
  // Expected: ['firstName', 'lastName', 'email', 'company', 'title']

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/text-variables-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/text-variables-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
