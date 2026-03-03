import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Enforce Brand Guidelines
 *
 * Demonstrates how to restrict users to approved brand assets and prevent
 * unauthorized modifications to brand elements using asset restrictions
 * and the scopes system in a server-side context.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({});

try {
  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 800 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create brand color source with approved colors only
  engine.asset.addLocalSource('brandColors');

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-primary',
    label: { en: 'Brand Blue' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.4, b: 0.8 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-secondary',
    label: { en: 'Brand Orange' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 0.6, b: 0.0 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-dark',
    label: { en: 'Dark Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.2, g: 0.2, b: 0.2 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-neutral-light',
    label: { en: 'Light Gray' },
    payload: {
      color: { colorSpace: 'sRGB', r: 0.9, g: 0.9, b: 0.9 },
    },
  });

  engine.asset.addAssetToSource('brandColors', {
    id: 'brand-white',
    label: { en: 'White' },
    payload: {
      color: { colorSpace: 'sRGB', r: 1.0, g: 1.0, b: 1.0 },
    },
  });

  // Set global scopes to Defer for block-level control
  engine.editor.setGlobalScope('layer/move', 'Defer');
  engine.editor.setGlobalScope('layer/resize', 'Defer');
  engine.editor.setGlobalScope('fill/change', 'Defer');
  engine.editor.setGlobalScope('fill/changeType', 'Defer');
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');
  engine.editor.setGlobalScope('text/edit', 'Defer');

  // Create a locked logo block that cannot be modified
  const logoBlock = engine.block.create('graphic');
  const logoShape = engine.block.createShape('rect');
  engine.block.setShape(logoBlock, logoShape);
  engine.block.setWidth(logoBlock, 200);
  engine.block.setHeight(logoBlock, 80);
  engine.block.setPositionX(logoBlock, 40);
  engine.block.setPositionY(logoBlock, 40);

  const logoFill = engine.block.createFill('color');
  engine.block.setColor(logoFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 1.0,
  });
  engine.block.setFill(logoBlock, logoFill);
  engine.block.setName(logoBlock, 'Company Logo');
  engine.block.appendChild(page, logoBlock);

  // Lock all editing capabilities on the logo
  engine.block.setScopeEnabled(logoBlock, 'layer/move', false);
  engine.block.setScopeEnabled(logoBlock, 'layer/resize', false);
  engine.block.setScopeEnabled(logoBlock, 'fill/change', false);
  engine.block.setScopeEnabled(logoBlock, 'fill/changeType', false);
  engine.block.setScopeEnabled(logoBlock, 'lifecycle/destroy', false);
  engine.block.setScopeEnabled(logoBlock, 'lifecycle/duplicate', false);

  // Create locked legal text
  const legalText = engine.block.create('text');
  engine.block.setWidth(legalText, pageWidth - 80);
  engine.block.setHeight(legalText, 30);
  engine.block.setPositionX(legalText, 40);
  engine.block.setPositionY(legalText, pageHeight - 50);
  engine.block.replaceText(
    legalText,
    '\u00A9 2024 Company Name. All rights reserved.'
  );
  engine.block.setFloat(legalText, 'text/fontSize', 36);
  engine.block.setName(legalText, 'Legal Text');
  engine.block.appendChild(page, legalText);

  // Lock the legal text
  engine.block.setScopeEnabled(legalText, 'layer/move', false);
  engine.block.setScopeEnabled(legalText, 'layer/resize', false);
  engine.block.setScopeEnabled(legalText, 'text/edit', false);
  engine.block.setScopeEnabled(legalText, 'lifecycle/destroy', false);

  // Create an editable content area where users can work with brand assets
  const contentBlock = engine.block.create('graphic');
  const contentShape = engine.block.createShape('rect');
  engine.block.setShape(contentBlock, contentShape);
  engine.block.setWidth(contentBlock, 400);
  engine.block.setHeight(contentBlock, 300);
  engine.block.setPositionX(contentBlock, (pageWidth - 400) / 2);
  engine.block.setPositionY(contentBlock, (pageHeight - 300) / 2);

  const contentFill = engine.block.createFill('color');
  engine.block.setColor(contentFill, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setFill(contentBlock, contentFill);
  engine.block.setName(contentBlock, 'Editable Content');
  engine.block.appendChild(page, contentBlock);

  // Enable all editing for the editable content block
  engine.block.setScopeEnabled(contentBlock, 'layer/move', true);
  engine.block.setScopeEnabled(contentBlock, 'layer/resize', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/change', true);
  engine.block.setScopeEnabled(contentBlock, 'fill/changeType', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/destroy', true);
  engine.block.setScopeEnabled(contentBlock, 'lifecycle/duplicate', true);

  // Create editable text
  const editableText = engine.block.create('text');
  engine.block.setWidth(editableText, 300);
  engine.block.setHeight(editableText, 60);
  engine.block.setPositionX(editableText, (pageWidth - 300) / 2);
  engine.block.setPositionY(editableText, 150);
  engine.block.replaceText(editableText, 'Edit This Headline');
  engine.block.setFloat(editableText, 'text/fontSize', 64);
  engine.block.setEnum(editableText, 'text/horizontalAlignment', 'Center');
  engine.block.setName(editableText, 'Editable Headline');
  engine.block.appendChild(page, editableText);

  // Enable text editing
  engine.block.setScopeEnabled(editableText, 'layer/move', true);
  engine.block.setScopeEnabled(editableText, 'layer/resize', true);
  engine.block.setScopeEnabled(editableText, 'text/edit', true);
  engine.block.setScopeEnabled(editableText, 'lifecycle/destroy', true);

  // Validate brand compliance
  const isLogoLocked = !engine.block.isAllowedByScope(logoBlock, 'layer/move');
  const isLegalLocked = !engine.block.isAllowedByScope(legalText, 'text/edit');
  const isContentEditable = engine.block.isAllowedByScope(
    contentBlock,
    'fill/change'
  );

  console.log('\n=== Brand Compliance Validation ===');
  console.log(`Logo is locked: ${isLogoLocked}`);
  console.log(`Legal text is locked: ${isLegalLocked}`);
  console.log(`Content block is editable: ${isContentEditable}`);

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export the result as PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/enforce-brand-guidelines-result.png`, buffer);

  console.log(
    '\n\u2713 Exported result to output/enforce-brand-guidelines-result.png'
  );
  console.log('\n=== Enforce Brand Guidelines Demo Complete ===');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
