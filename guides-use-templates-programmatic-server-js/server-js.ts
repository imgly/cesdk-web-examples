import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Use Templates Programmatically (Server/Node.js)
 *
 * This example demonstrates headless template workflows:
 * 1. Creating templates from scratch with text variables
 * 2. Setting up text variables for dynamic content
 * 3. Batch processing: populating templates with data
 * 4. Exporting multiple personalized outputs
 */

async function run() {
  let engine;

  try {
    const config = {
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');

    // Create a greeting card template from scratch
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Set up text variables FIRST so they're available when text is created
    engine.variable.setString('recipientName', 'Template');
    engine.variable.setString('customMessage', 'This is a template example');

    // Add title text block with variable placeholder
    const titleBlock = engine.block.create('text');
    engine.block.setName(titleBlock, 'title');
    engine.block.appendChild(page, titleBlock);
    engine.block.setPositionX(titleBlock, 50);
    engine.block.setPositionY(titleBlock, 50);
    engine.block.setWidth(titleBlock, 700);
    engine.block.setHeight(titleBlock, 80);

    // Set text with variable syntax
    engine.block.replaceText(titleBlock, 'Hello, {{recipientName}}!');
    engine.block.setTextColor(titleBlock, {
      r: 0.2,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Configure font size and weight
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setBool(titleBlock, 'text/bold', true);

    // Add message text block with variable
    const messageBlock = engine.block.create('text');
    engine.block.setName(messageBlock, 'message');
    engine.block.appendChild(page, messageBlock);
    engine.block.setPositionX(messageBlock, 50);
    engine.block.setPositionY(messageBlock, 140);
    engine.block.setWidth(messageBlock, 700);
    engine.block.setHeight(messageBlock, 120);

    engine.block.replaceText(messageBlock, '{{customMessage}}');
    engine.block.setTextColor(messageBlock, {
      r: 0.3,
      g: 0.3,
      b: 0.3,
      a: 1.0
    });

    engine.block.setFloat(messageBlock, 'text/fontSize', 28);

    console.log('✓ Template structure created');

    // Variables have already been set earlier in the template creation
    // List all variables
    const allVariables = engine.variable.findAll();
    console.log('✓ Variables initialized:', allVariables);

    // Save the template for reuse
    const templateString = await engine.scene.saveToString();
    writeFileSync('template.scene', templateString);
    console.log('✓ Template saved to template.scene');

    // Demonstrate batch processing: populate template with multiple data records
    const recipients = [
      {
        name: 'Alice',
        message: 'Congratulations on your promotion!'
      },
      {
        name: 'Bob',
        message: 'Happy Birthday! Have a wonderful day!'
      },
      {
        name: 'Charlie',
        message: 'Thank you for your amazing work!'
      }
    ];

    console.log('\n✓ Starting batch processing...');

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      // Populate template with recipient data
      engine.variable.setString('recipientName', recipient.name);
      engine.variable.setString('customMessage', recipient.message);

      // Export the personalized card
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 800,
        targetHeight: 600
      });

      const filename = `greeting-card-${recipient.name.toLowerCase()}.png`;
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(filename, buffer);
      console.log(`  ✓ Exported ${filename}`);
    }

    console.log('\n✓ Batch processing complete!');
    console.log(`✓ Generated ${recipients.length} personalized cards`);

    console.log('\n✓ All operations completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Always dispose the engine
    engine?.dispose();
    console.log('\n✓ Engine disposed');
  }
}

// Run the example
run();
