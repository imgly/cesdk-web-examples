import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Combine Shapes
 *
 * Demonstrates combining shapes using boolean operations in Node.js:
 * - Checking combinability before operations
 * - Union: Merging shapes together
 * - Difference: Creating punch-out effects
 * - Intersection: Extracting overlapping areas
 * - XOR: Creating exclusion patterns
 * - Understanding fill inheritance
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

  // ===== Demonstration 1: Union Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } },
  });
  let page = engine.block.findByType('page')[0];

  // Create three circles for union demonstration
  const unionCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const unionFill1 = engine.block.createFill('color');
  engine.block.setColor(unionFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.4,
    b: 0.4,
    a: 1.0,
  });
  engine.block.setFill(unionCircle1, unionFill1);
  engine.block.setWidth(unionCircle1, 120);
  engine.block.setHeight(unionCircle1, 120);
  engine.block.setPositionX(unionCircle1, 100);
  engine.block.setPositionY(unionCircle1, 80);
  engine.block.appendChild(page, unionCircle1);

  const unionCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const unionFill2 = engine.block.createFill('color');
  engine.block.setColor(unionFill2, 'fill/color/value', {
    r: 0.4,
    g: 1.0,
    b: 0.4,
    a: 1.0,
  });
  engine.block.setFill(unionCircle2, unionFill2);
  engine.block.setWidth(unionCircle2, 120);
  engine.block.setHeight(unionCircle2, 120);
  engine.block.setPositionX(unionCircle2, 180);
  engine.block.setPositionY(unionCircle2, 100);
  engine.block.appendChild(page, unionCircle2);

  const unionCircle3 = engine.block.create('graphic');
  engine.block.setShape(
    unionCircle3,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const unionFill3 = engine.block.createFill('color');
  engine.block.setColor(unionFill3, 'fill/color/value', {
    r: 0.4,
    g: 0.4,
    b: 1.0,
    a: 1.0,
  });
  engine.block.setFill(unionCircle3, unionFill3);
  engine.block.setWidth(unionCircle3, 120);
  engine.block.setHeight(unionCircle3, 120);
  engine.block.setPositionX(unionCircle3, 140);
  engine.block.setPositionY(unionCircle3, 140);
  engine.block.appendChild(page, unionCircle3);

  // Check if blocks can be combined before attempting operations
  const canCombineUnion = engine.block.isCombinable([
    unionCircle1,
    unionCircle2,
    unionCircle3,
  ]);

  // Merge three circles using Union operation
  if (canCombineUnion) {
    engine.block.combine(
      [unionCircle1, unionCircle2, unionCircle3],
      'Union',
    );
  }

  // Export Union result
  let blob = await engine.block.export(page, { mimeType: 'image/png' });
  let buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-union-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported Union result to output/combine-union-result.png');

  // ===== Demonstration 2: Difference Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } },
  });
  page = engine.block.findByType('page')[0];

  // Create image block for base
  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(
    imageBlock,
    engine.block.createShape('//ly.img.ubq/shape/rect'),
  );
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg',
  );
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 360);
  engine.block.setHeight(imageBlock, 240);
  engine.block.setPositionX(imageBlock, 20);
  engine.block.setPositionY(imageBlock, 30);
  engine.block.appendChild(page, imageBlock);

  // Create text block for punch-out
  const textBlock = engine.block.create('text');
  engine.block.replaceText(textBlock, 'CUTOUT');
  engine.block.setFloat(textBlock, 'text/fontSize', 120);
  engine.block.setPositionX(textBlock, 60);
  engine.block.setPositionY(textBlock, 90);
  engine.block.appendChild(page, textBlock);

  // Ensure image is at bottom for Difference operation
  engine.block.sendToBack(imageBlock);

  const canCombineDiff = engine.block.isCombinable([imageBlock, textBlock]);

  // Create punch-out text effect using Difference operation
  if (canCombineDiff) {
    engine.block.combine([imageBlock, textBlock], 'Difference');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-difference-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log(
    '✓ Exported Difference result to output/combine-difference-result.png',
  );

  // ===== Demonstration 3: Intersection Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } },
  });
  page = engine.block.findByType('page')[0];

  // Create two overlapping circles for intersection
  const intersectCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    intersectCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const intersectFill1 = engine.block.createFill('color');
  engine.block.setColor(intersectFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.2,
    a: 1.0,
  });
  engine.block.setFill(intersectCircle1, intersectFill1);
  engine.block.setWidth(intersectCircle1, 144);
  engine.block.setHeight(intersectCircle1, 144);
  engine.block.setPositionX(intersectCircle1, 128);
  engine.block.setPositionY(intersectCircle1, 90);
  engine.block.appendChild(page, intersectCircle1);

  const intersectCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    intersectCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const intersectFill2 = engine.block.createFill('color');
  engine.block.setColor(intersectFill2, 'fill/color/value', {
    r: 1.0,
    g: 0.6,
    b: 0.2,
    a: 1.0,
  });
  engine.block.setFill(intersectCircle2, intersectFill2);
  engine.block.setWidth(intersectCircle2, 144);
  engine.block.setHeight(intersectCircle2, 144);
  engine.block.setPositionX(intersectCircle2, 128);
  engine.block.setPositionY(intersectCircle2, 162);
  engine.block.appendChild(page, intersectCircle2);

  const canCombineIntersect = engine.block.isCombinable([
    intersectCircle1,
    intersectCircle2,
  ]);

  // Extract overlapping area using Intersection operation
  if (canCombineIntersect) {
    engine.block.combine([intersectCircle1, intersectCircle2], 'Intersection');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-intersection-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log(
    '✓ Exported Intersection result to output/combine-intersection-result.png',
  );

  // ===== Demonstration 4: XOR Operation =====
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 300 } },
  });
  page = engine.block.findByType('page')[0];

  // Create two overlapping circles for XOR
  const xorCircle1 = engine.block.create('graphic');
  engine.block.setShape(
    xorCircle1,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const xorFill1 = engine.block.createFill('color');
  engine.block.setColor(xorFill1, 'fill/color/value', {
    r: 1.0,
    g: 0.8,
    b: 0.2,
    a: 1.0,
  });
  engine.block.setFill(xorCircle1, xorFill1);
  engine.block.setWidth(xorCircle1, 140);
  engine.block.setHeight(xorCircle1, 140);
  engine.block.setPositionX(xorCircle1, 110);
  engine.block.setPositionY(xorCircle1, 80);
  engine.block.appendChild(page, xorCircle1);

  const xorCircle2 = engine.block.create('graphic');
  engine.block.setShape(
    xorCircle2,
    engine.block.createShape('//ly.img.ubq/shape/ellipse'),
  );
  const xorFill2 = engine.block.createFill('color');
  engine.block.setColor(xorFill2, 'fill/color/value', {
    r: 0.6,
    g: 0.4,
    b: 1.0,
    a: 1.0,
  });
  engine.block.setFill(xorCircle2, xorFill2);
  engine.block.setWidth(xorCircle2, 140);
  engine.block.setHeight(xorCircle2, 140);
  engine.block.setPositionX(xorCircle2, 166);
  engine.block.setPositionY(xorCircle2, 108);
  engine.block.appendChild(page, xorCircle2);

  const canCombineXor = engine.block.isCombinable([xorCircle1, xorCircle2]);

  // Create exclusion shape using XOR operation
  if (canCombineXor) {
    engine.block.combine([xorCircle1, xorCircle2], 'XOR');
  }

  blob = await engine.block.export(page, { mimeType: 'image/png' });
  buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/combine-xor-result.png`, buffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported XOR result to output/combine-xor-result.png');

  // eslint-disable-next-line no-console
  console.log('\n✓ All boolean operations completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
