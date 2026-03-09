import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, {
      cols: 2,
      rows: 2,
      spacing: 20,
      margin: 20
    });
    const { blockWidth, blockHeight, getPosition } = layout;

    // ===== Demonstration 1: Union Operation =====
    // Create three equal circles for union demonstration
    const circleSize = 120;
    const unionCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const unionFill1 = engine.block.createFill('color');
    engine.block.setColor(unionFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.4,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(unionCircle1, unionFill1);
    engine.block.setWidth(unionCircle1, circleSize);
    engine.block.setHeight(unionCircle1, circleSize);
    engine.block.appendChild(page, unionCircle1);

    const unionCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const unionFill2 = engine.block.createFill('color');
    engine.block.setColor(unionFill2, 'fill/color/value', {
      r: 0.4,
      g: 1.0,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(unionCircle2, unionFill2);
    engine.block.setWidth(unionCircle2, circleSize);
    engine.block.setHeight(unionCircle2, circleSize);
    engine.block.appendChild(page, unionCircle2);

    const unionCircle3 = engine.block.create('graphic');
    engine.block.setShape(
      unionCircle3,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const unionFill3 = engine.block.createFill('color');
    engine.block.setColor(unionFill3, 'fill/color/value', {
      r: 0.4,
      g: 0.4,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(unionCircle3, unionFill3);
    engine.block.setWidth(unionCircle3, circleSize);
    engine.block.setHeight(unionCircle3, circleSize);
    engine.block.appendChild(page, unionCircle3);

    // ===== Demonstration 2: Difference Operation =====
    // Create image block for punch-out effect
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(
      imageBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, blockWidth * 0.9);
    engine.block.setHeight(imageBlock, blockHeight * 0.9);
    engine.block.appendChild(page, imageBlock);

    // Create text block for punch-out
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'CUTOUT');
    engine.block.setFloat(textBlock, 'text/fontSize', 120);
    engine.block.setWidth(textBlock, blockWidth * 0.9);
    engine.block.appendChild(page, textBlock);

    // ===== Demonstration 3: Intersection Operation =====
    // Create two overlapping circles for intersection (20% larger)
    const intersectCircleSize = circleSize * 1.2;
    const intersectCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      intersectCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const intersectFill1 = engine.block.createFill('color');
    engine.block.setColor(intersectFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.6,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(intersectCircle1, intersectFill1);
    engine.block.setWidth(intersectCircle1, intersectCircleSize);
    engine.block.setHeight(intersectCircle1, intersectCircleSize);
    engine.block.appendChild(page, intersectCircle1);

    const intersectCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      intersectCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const intersectFill2 = engine.block.createFill('color');
    engine.block.setColor(intersectFill2, 'fill/color/value', {
      r: 1.0,
      g: 0.6,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(intersectCircle2, intersectFill2);
    engine.block.setWidth(intersectCircle2, intersectCircleSize);
    engine.block.setHeight(intersectCircle2, intersectCircleSize);
    engine.block.appendChild(page, intersectCircle2);

    // ===== Demonstration 4: XOR Operation =====
    // Create two overlapping circles for XOR
    const xorCircle1 = engine.block.create('graphic');
    engine.block.setShape(
      xorCircle1,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const xorFill1 = engine.block.createFill('color');
    engine.block.setColor(xorFill1, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(xorCircle1, xorFill1);
    engine.block.setWidth(xorCircle1, 140);
    engine.block.setHeight(xorCircle1, 140);
    engine.block.appendChild(page, xorCircle1);

    const xorCircle2 = engine.block.create('graphic');
    engine.block.setShape(
      xorCircle2,
      engine.block.createShape('//ly.img.ubq/shape/ellipse')
    );
    const xorFill2 = engine.block.createFill('color');
    engine.block.setColor(xorFill2, 'fill/color/value', {
      r: 0.2,
      g: 0.8,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(xorCircle2, xorFill2);
    engine.block.setWidth(xorCircle2, 140);
    engine.block.setHeight(xorCircle2, 140);
    engine.block.appendChild(page, xorCircle2);

    // Position all blocks in grid layout before combining
    // Position union circles at vertices of equilateral triangle in top-left quadrant
    const unionPos = getPosition(0);
    const unionCenterX = unionPos.x + blockWidth / 2;
    const unionCenterY = unionPos.y + blockHeight / 2;
    const triangleRadius = 55; // Distance from center to each vertex
    const halfCircle = circleSize / 2;
    // Top vertex
    engine.block.setPositionX(unionCircle1, unionCenterX - halfCircle);
    engine.block.setPositionY(
      unionCircle1,
      unionCenterY - triangleRadius - halfCircle
    );
    // Bottom-right vertex (angle -30°)
    engine.block.setPositionX(
      unionCircle2,
      unionCenterX + triangleRadius * 0.866 - halfCircle
    );
    engine.block.setPositionY(
      unionCircle2,
      unionCenterY + triangleRadius * 0.5 - halfCircle
    );
    // Bottom-left vertex (angle 210°)
    engine.block.setPositionX(
      unionCircle3,
      unionCenterX - triangleRadius * 0.866 - halfCircle
    );
    engine.block.setPositionY(
      unionCircle3,
      unionCenterY + triangleRadius * 0.5 - halfCircle
    );

    // Center image in top-right quadrant, then center text on image
    const diffPos = getPosition(1);
    const imageX =
      diffPos.x + (blockWidth - engine.block.getWidth(imageBlock)) / 2;
    const imageY =
      diffPos.y + (blockHeight - engine.block.getHeight(imageBlock)) / 2;
    engine.block.setPositionX(imageBlock, imageX);
    engine.block.setPositionY(imageBlock, imageY);

    // Center text on the image block (not the quadrant)
    const textX =
      imageX +
      (engine.block.getWidth(imageBlock) - engine.block.getWidth(textBlock)) /
        2;
    const textY =
      imageY +
      (engine.block.getHeight(imageBlock) - engine.block.getHeight(textBlock)) /
        2;
    engine.block.setPositionX(textBlock, textX);
    engine.block.setPositionY(textBlock, textY);

    // Center intersection circles in bottom-left quadrant with vertical overlap
    const intersectPos = getPosition(2);
    const intersectCenterX = intersectPos.x + blockWidth / 2;
    const intersectCenterY = intersectPos.y + blockHeight / 2;
    const halfIntersectCircle = intersectCircleSize / 2;
    // Position circles to overlap vertically by about 50% (72px offset for 144px circles)
    engine.block.setPositionX(
      intersectCircle1,
      intersectCenterX - halfIntersectCircle
    );
    engine.block.setPositionY(
      intersectCircle1,
      intersectCenterY - halfIntersectCircle - 36
    );
    engine.block.setPositionX(
      intersectCircle2,
      intersectCenterX - halfIntersectCircle
    );
    engine.block.setPositionY(
      intersectCircle2,
      intersectCenterY - halfIntersectCircle + 36
    );

    // Center XOR circles in bottom-right quadrant
    const xorPos = getPosition(3);
    const xorCenterX = xorPos.x + blockWidth / 2;
    const xorCenterY = xorPos.y + blockHeight / 2;
    engine.block.setPositionX(xorCircle1, xorCenterX - 70);
    engine.block.setPositionY(xorCircle1, xorCenterY - 70);
    engine.block.setPositionX(xorCircle2, xorCenterX - 14);
    engine.block.setPositionY(xorCircle2, xorCenterY - 42);

    // Perform boolean operations
    // Check if blocks can be combined before attempting operations
    const canCombineUnion = engine.block.isCombinable([
      unionCircle1,
      unionCircle2,
      unionCircle3
    ]);
    const canCombineDiff = engine.block.isCombinable([imageBlock, textBlock]);
    const canCombineIntersect = engine.block.isCombinable([
      intersectCircle1,
      intersectCircle2
    ]);
    const canCombineXor = engine.block.isCombinable([xorCircle1, xorCircle2]);

    // Combine three circles using Union operation
    if (canCombineUnion) {
      engine.block.combine([unionCircle1, unionCircle2, unionCircle3], 'Union');
    }

    // Create punch-out effect using Difference operation
    // Ensure image is at the bottom (will be the base block)
    if (canCombineDiff) {
      engine.block.sendToBack(imageBlock);
      engine.block.combine([imageBlock, textBlock], 'Difference');
    }

    // Extract overlapping area using Intersection operation
    if (canCombineIntersect) {
      engine.block.combine(
        [intersectCircle1, intersectCircle2],
        'Intersection'
      );
    }

    // Create exclusion pattern using XOR operation
    if (canCombineXor) {
      engine.block.combine([xorCircle1, xorCircle2], 'XOR');
    }

    // Zoom to fit all demonstrations
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
