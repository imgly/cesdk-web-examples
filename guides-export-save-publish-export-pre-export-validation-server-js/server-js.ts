import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

config();

type ValidationSeverity = 'error' | 'warning';

interface ValidationIssue {
  type:
    | 'outside_page'
    | 'protruding'
    | 'text_obscured'
    | 'unfilled_placeholder';
  severity: ValidationSeverity;
  blockId: number;
  blockName: string;
  message: string;
}

interface ValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const engine = await CreativeEngine.init({
  license: process.env.CESDK_LICENSE
});

try {
  // Create a scene with test elements that demonstrate validation issues
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });

  const page = engine.block.findByType('page')[0];
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const centerY = pageHeight / 2;

  // Row layout: Main validation examples (horizontally aligned)
  const row1Y = centerY - 50;
  const elementWidth = 150;
  const elementHeight = 100;
  const spacing = 20;

  // Calculate positions for 4 elements in a row
  const totalRowWidth = elementWidth * 4 + spacing * 3;
  const startX = (pageWidth - totalRowWidth) / 2;

  // Create an image that's outside the page (will trigger error)
  // Positioned to the left of the page - completely outside
  const outsideImage = engine.block.create('graphic');
  engine.block.setName(outsideImage, 'Outside Image');
  engine.block.setShape(outsideImage, engine.block.createShape('rect'));
  const outsideFill = engine.block.createFill('image');
  engine.block.setString(
    outsideFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(outsideImage, outsideFill);
  engine.block.setWidth(outsideImage, elementWidth);
  engine.block.setHeight(outsideImage, elementHeight);
  engine.block.setPositionX(outsideImage, -elementWidth - 10); // Left of the page
  engine.block.setPositionY(outsideImage, row1Y);
  engine.block.appendChild(page, outsideImage);

  // Create a properly placed image for reference (first in row)
  const validImage = engine.block.create('graphic');
  engine.block.setName(validImage, 'Valid Image');
  engine.block.setShape(validImage, engine.block.createShape('rect'));
  const validFill = engine.block.createFill('image');
  engine.block.setString(
    validFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_3.jpg'
  );
  engine.block.setFill(validImage, validFill);
  engine.block.setWidth(validImage, elementWidth);
  engine.block.setHeight(validImage, elementHeight);
  engine.block.setPositionX(validImage, startX);
  engine.block.setPositionY(validImage, row1Y);
  engine.block.appendChild(page, validImage);

  // Create unfilled placeholder (second in row - triggers error)
  const placeholder = engine.block.create('graphic');
  engine.block.setName(placeholder, 'Unfilled Placeholder');
  engine.block.setShape(placeholder, engine.block.createShape('rect'));
  const placeholderFill = engine.block.createFill('image');
  engine.block.setFill(placeholder, placeholderFill);
  engine.block.setWidth(placeholder, elementWidth);
  engine.block.setHeight(placeholder, elementHeight);
  engine.block.setPositionX(placeholder, startX + elementWidth + spacing);
  engine.block.setPositionY(placeholder, row1Y);
  engine.block.appendChild(page, placeholder);
  engine.block.setScopeEnabled(placeholder, 'fill/change', true);
  engine.block.setPlaceholderBehaviorEnabled(placeholderFill, true);
  engine.block.setPlaceholderEnabled(placeholder, true);

  // Create text that will be partially obscured (third in row)
  const obscuredText = engine.block.create('text');
  engine.block.setName(obscuredText, 'Obscured Text');
  engine.block.setPositionX(
    obscuredText,
    startX + (elementWidth + spacing) * 2
  );
  engine.block.setPositionY(obscuredText, row1Y);
  engine.block.setWidth(obscuredText, elementWidth);
  engine.block.setHeight(obscuredText, elementHeight);
  engine.block.replaceText(obscuredText, 'Hidden');
  engine.block.setFloat(obscuredText, 'text/fontSize', 48);
  engine.block.appendChild(page, obscuredText);

  // Create a shape that overlaps the text (added after text = on top)
  const overlappingShape = engine.block.create('graphic');
  engine.block.setName(overlappingShape, 'Overlapping Shape');
  engine.block.setShape(overlappingShape, engine.block.createShape('rect'));
  const shapeFill = engine.block.createFill('color');
  engine.block.setColor(shapeFill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.8,
    a: 0.8
  });
  engine.block.setFill(overlappingShape, shapeFill);
  engine.block.setWidth(overlappingShape, elementWidth);
  engine.block.setHeight(overlappingShape, elementHeight);
  engine.block.setPositionX(
    overlappingShape,
    startX + (elementWidth + spacing) * 2
  );
  engine.block.setPositionY(overlappingShape, row1Y);
  engine.block.appendChild(page, overlappingShape);

  // Create an image that protrudes from the page (fourth in row - will trigger warning)
  // Extends past right page boundary
  const protrudingImage = engine.block.create('graphic');
  engine.block.setName(protrudingImage, 'Protruding Image');
  engine.block.setShape(protrudingImage, engine.block.createShape('rect'));
  const protrudingFill = engine.block.createFill('image');
  engine.block.setString(
    protrudingFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_2.jpg'
  );
  engine.block.setFill(protrudingImage, protrudingFill);
  engine.block.setWidth(protrudingImage, elementWidth);
  engine.block.setHeight(protrudingImage, elementHeight);
  engine.block.setPositionX(protrudingImage, pageWidth - elementWidth / 2); // Extends past right
  engine.block.setPositionY(protrudingImage, row1Y);
  engine.block.appendChild(page, protrudingImage);

  // Validate design before export
  const result = validateDesign(engine);

  console.log('=== Pre-Export Validation ===');

  // Log all issues for debugging
  if (result.errors.length > 0) {
    console.error(`Found ${result.errors.length} error(s):`);
    result.errors.forEach((err) =>
      console.error(`  - ${err.blockName}: ${err.message}`)
    );
  }

  if (result.warnings.length > 0) {
    console.warn(`Found ${result.warnings.length} warning(s):`);
    result.warnings.forEach((warn) =>
      console.warn(`  - ${warn.blockName}: ${warn.message}`)
    );
  }

  // Block export for errors
  if (result.errors.length > 0) {
    console.error('\nExport blocked: Fix errors before exporting');
    process.exit(1);
  }

  // Allow export with warnings
  if (result.warnings.length > 0) {
    console.log('\nProceeding with export despite warnings...');
  } else {
    console.log('\nValidation passed - no issues found');
  }

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/validated-design.png`, buffer);
  console.log('Export successful: output/validated-design.png');
} finally {
  engine.dispose();
}

function getBoundingBox(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): [number, number, number, number] {
  const x = engine.block.getGlobalBoundingBoxX(blockId);
  const y = engine.block.getGlobalBoundingBoxY(blockId);
  const width = engine.block.getGlobalBoundingBoxWidth(blockId);
  const height = engine.block.getGlobalBoundingBoxHeight(blockId);
  return [x, y, x + width, y + height];
}

function calculateOverlap(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  const [ax1, ay1, ax2, ay2] = box1;
  const [bx1, by1, bx2, by2] = box2;

  const overlapWidth = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
  const overlapHeight = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
  const overlapArea = overlapWidth * overlapHeight;

  const box1Area = (ax2 - ax1) * (ay2 - ay1);
  if (box1Area === 0) return 0;

  return overlapArea / box1Area;
}

function getBlockName(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): string {
  const name = engine.block.getName(blockId);
  if (name) return name;
  const kind = engine.block.getKind(blockId);
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function getRelevantBlocks(
  engine: InstanceType<typeof CreativeEngine>
): number[] {
  return [
    ...engine.block.findByType('text'),
    ...engine.block.findByType('graphic')
  ];
}

function findOutsideBlocks(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const pageBounds = getBoundingBox(engine, page);

  for (const blockId of getRelevantBlocks(engine)) {
    if (!engine.block.isValid(blockId)) continue;

    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    if (overlap === 0) {
      // Element is completely outside the page
      issues.push({
        type: 'outside_page',
        severity: 'error',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Element is completely outside the visible page area'
      });
    }
  }

  return issues;
}

function findProtrudingBlocks(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const pageBounds = getBoundingBox(engine, page);

  for (const blockId of getRelevantBlocks(engine)) {
    if (!engine.block.isValid(blockId)) continue;

    // Compare element bounds against page bounds
    const blockBounds = getBoundingBox(engine, blockId);
    const overlap = calculateOverlap(blockBounds, pageBounds);

    // Protruding: partially inside (overlap > 0) but not fully inside (overlap < 1)
    if (overlap > 0 && overlap < 0.99) {
      issues.push({
        type: 'protruding',
        severity: 'warning',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Element extends beyond page boundaries'
      });
    }
  }

  return issues;
}

function findObscuredText(
  engine: InstanceType<typeof CreativeEngine>,
  page: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const children = engine.block.getChildren(page);
  const textBlocks = engine.block.findByType('text');

  for (const textId of textBlocks) {
    if (!engine.block.isValid(textId)) continue;

    const textIndex = children.indexOf(textId);
    if (textIndex === -1) continue;

    // Elements later in children array are rendered on top
    const blocksAbove = children.slice(textIndex + 1);

    for (const aboveId of blocksAbove) {
      // Skip text blocks - they don't typically obscure other text
      if (engine.block.getType(aboveId) === '//ly.img.ubq/text') continue;

      const overlap = calculateOverlap(
        getBoundingBox(engine, textId),
        getBoundingBox(engine, aboveId)
      );

      if (overlap > 0) {
        // Text is obscured by element above it
        issues.push({
          type: 'text_obscured',
          severity: 'warning',
          blockId: textId,
          blockName: getBlockName(engine, textId),
          message: 'Text may be partially hidden by overlapping elements'
        });
        break;
      }
    }
  }

  return issues;
}

function findUnfilledPlaceholders(
  engine: InstanceType<typeof CreativeEngine>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const placeholders = engine.block.findAllPlaceholders();

  for (const blockId of placeholders) {
    if (!engine.block.isValid(blockId)) continue;

    if (!isPlaceholderFilled(engine, blockId)) {
      issues.push({
        type: 'unfilled_placeholder',
        severity: 'error',
        blockId,
        blockName: getBlockName(engine, blockId),
        message: 'Placeholder has not been filled with content'
      });
    }
  }

  return issues;
}

function isPlaceholderFilled(
  engine: InstanceType<typeof CreativeEngine>,
  blockId: number
): boolean {
  const fillId = engine.block.getFill(blockId);
  if (!fillId || !engine.block.isValid(fillId)) return false;

  const fillType = engine.block.getType(fillId);

  // Check image fill - empty URI means unfilled placeholder
  if (fillType === '//ly.img.ubq/fill/image') {
    const imageUri = engine.block.getString(fillId, 'fill/image/imageFileURI');
    return imageUri !== '' && imageUri !== undefined;
  }

  // Other fill types are considered filled
  return true;
}

function validateDesign(
  engine: InstanceType<typeof CreativeEngine>
): ValidationResult {
  const page = engine.block.findByType('page')[0];

  const outsideIssues = findOutsideBlocks(engine, page);
  const protrudingIssues = findProtrudingBlocks(engine, page);
  const obscuredIssues = findObscuredText(engine, page);
  const placeholderIssues = findUnfilledPlaceholders(engine);

  const allIssues = [
    ...outsideIssues,
    ...protrudingIssues,
    ...obscuredIssues,
    ...placeholderIssues
  ];

  return {
    errors: allIssues.filter((i) => i.severity === 'error'),
    warnings: allIssues.filter((i) => i.severity === 'warning')
  };
}
