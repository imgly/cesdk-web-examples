import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit or Remove Templates
 *
 * Demonstrates template management workflows in headless Node.js:
 * - Adding templates to local asset sources with thumbnails
 * - Editing template content and updating in asset sources
 * - Removing templates from asset sources
 * - Saving updated templates with new content
 */

// Helper function to prompt user for input
function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Helper function to generate SVG thumbnail with text label
function generateThumbnail(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
    <rect width="200" height="150" fill="#f5f5f5"/>
    <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" fill="#333">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a local asset source for managing templates
  engine.asset.addLocalSource('my-templates');

  // Create the template with text blocks
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Original Template');
  engine.block.setFloat(titleBlock, 'text/fontSize', 14);
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);

  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(subtitleBlock, 'Server-side template management');
  engine.block.setFloat(subtitleBlock, 'text/fontSize', 10);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);

  // Position text blocks centered on the page
  const pageWidth = 1200;
  const pageHeight = 600;
  const titleWidth = engine.block.getFrameWidth(titleBlock);
  const titleHeight = engine.block.getFrameHeight(titleBlock);
  engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
  engine.block.setPositionY(titleBlock, pageHeight / 2 - titleHeight - 20);

  const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
  engine.block.setPositionY(subtitleBlock, pageHeight / 2 + 20);

  // Save template content and add to asset source
  const originalContent = await engine.scene.saveToString();
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-original',
    label: { en: 'Original Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${originalContent}`,
      thumbUri: generateThumbnail('Original Template')
    }
  });

  // eslint-disable-next-line no-console
  console.log('Original template added to asset source');

  // Edit the template content and save as a new version
  engine.block.replaceText(titleBlock, 'Updated Template');
  engine.block.replaceText(subtitleBlock, 'This template was edited and saved');

  const updatedContent = await engine.scene.saveToString();
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${updatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });

  // Re-center after modification
  const newTitleWidth = engine.block.getFrameWidth(titleBlock);
  const newTitleHeight = engine.block.getFrameHeight(titleBlock);
  engine.block.setPositionX(titleBlock, (pageWidth - newTitleWidth) / 2);
  engine.block.setPositionY(titleBlock, pageHeight / 2 - newTitleHeight - 20);

  const newSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(subtitleBlock, (pageWidth - newSubtitleWidth) / 2);

  // eslint-disable-next-line no-console
  console.log('Updated template added to asset source');

  // Add a temporary template to demonstrate removal
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-temporary',
    label: { en: 'Temporary Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${originalContent}`,
      thumbUri: generateThumbnail('Temporary Template')
    }
  });

  // Remove the temporary template from the asset source
  engine.asset.removeAssetFromSource('my-templates', 'template-temporary');

  // eslint-disable-next-line no-console
  console.log('Temporary template removed from asset source');

  // Update an existing template by removing and re-adding with same ID
  engine.block.replaceText(subtitleBlock, 'Updated again with new content');
  const reUpdatedContent = await engine.scene.saveToString();

  engine.asset.removeAssetFromSource('my-templates', 'template-updated');
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-updated',
    label: { en: 'Updated Template' },
    meta: {
      uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
      thumbUri: generateThumbnail('Updated Template')
    }
  });

  // Notify that the asset source contents have changed
  engine.asset.assetSourceContentsChanged('my-templates');

  // Re-center subtitle after final update
  const reUpdatedSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  engine.block.setPositionX(subtitleBlock, (pageWidth - reUpdatedSubtitleWidth) / 2);

  // eslint-disable-next-line no-console
  console.log('Template updated in asset source');

  // Export templates based on user choice
  // eslint-disable-next-line no-console
  console.log('\n--- Template Export ---');
  // eslint-disable-next-line no-console
  console.log('1. Original Template');
  // eslint-disable-next-line no-console
  console.log('2. Updated Template');
  // eslint-disable-next-line no-console
  console.log('3. Both Templates');

  const choice = await prompt(
    '\nWhich template would you like to export? (1/2/3): '
  );

  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Load and export based on user choice
  if (choice === '1' || choice === '3') {
    await engine.scene.loadFromString(originalContent);
    const originalBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    const originalBuffer = Buffer.from(await originalBlob.arrayBuffer());
    writeFileSync(`${outputDir}/template-original.png`, originalBuffer);
    // eslint-disable-next-line no-console
    console.log('✓ Exported: output/template-original.png');
  }

  if (choice === '2' || choice === '3') {
    await engine.scene.loadFromString(reUpdatedContent);
    const updatedBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    const updatedBuffer = Buffer.from(await updatedBlob.arrayBuffer());
    writeFileSync(`${outputDir}/template-updated.png`, updatedBuffer);
    // eslint-disable-next-line no-console
    console.log('✓ Exported: output/template-updated.png');
  }

  if (choice !== '1' && choice !== '2' && choice !== '3') {
    // eslint-disable-next-line no-console
    console.log('Invalid choice. Exporting both templates by default.');
    await engine.scene.loadFromString(originalContent);
    const originalBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    writeFileSync(
      `${outputDir}/template-original.png`,
      Buffer.from(await originalBlob.arrayBuffer())
    );

    await engine.scene.loadFromString(reUpdatedContent);
    const updatedBlob = await engine.block.export(
      engine.block.findByType('page')[0],
      { mimeType: 'image/png' }
    );
    writeFileSync(
      `${outputDir}/template-updated.png`,
      Buffer.from(await updatedBlob.arrayBuffer())
    );
    // eslint-disable-next-line no-console
    console.log('✓ Exported both templates to output/');
  }
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
