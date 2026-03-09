import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

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
import packageJson from './package.json';

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
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    await cesdk.actions.run('scene.create', { page: { width: 800, height: 600, unit: 'Pixel' } });

    const engine = cesdk.engine;

    // Set role to adopter so placeholders can be replaced
    engine.editor.setRole('Adopter');

    const page = engine.block.findByType('page')[0];

    await this.createDemoScene(engine, page);
    this.overrideExportAction(cesdk, engine);
  }

  private async createDemoScene(
    engine: CreativeEngine,
    page: number
  ): Promise<void> {
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const centerY = pageHeight / 2;

    // Row 1: Main validation examples (horizontally aligned)
    const row1Y = centerY - 120;
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
    engine.block.setPlaceholderControlsOverlayEnabled(placeholder, true);
    engine.block.setPlaceholderControlsButtonEnabled(placeholder, true);

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
    engine.block.setPositionX(protrudingImage, pageWidth - elementWidth / 2); // Extends 75px past right
    engine.block.setPositionY(protrudingImage, row1Y);
    engine.block.appendChild(page, protrudingImage);

    // Add explanatory text below the row
    const explanationText = engine.block.create('text');
    engine.block.setPositionX(explanationText, 50);
    engine.block.setPositionY(explanationText, row1Y + elementHeight + 40);
    engine.block.setWidth(explanationText, pageWidth - 100);
    engine.block.setHeightMode(explanationText, 'Auto');
    engine.block.replaceText(
      explanationText,
      'Click Export to run validation. Move elements to fix issues.'
    );
    engine.block.setFloat(explanationText, 'text/fontSize', 48);
    engine.block.setEnum(explanationText, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, explanationText);
  }

  private getBoundingBox(
    engine: CreativeEngine,
    blockId: number
  ): [number, number, number, number] {
    const x = engine.block.getGlobalBoundingBoxX(blockId);
    const y = engine.block.getGlobalBoundingBoxY(blockId);
    const width = engine.block.getGlobalBoundingBoxWidth(blockId);
    const height = engine.block.getGlobalBoundingBoxHeight(blockId);
    return [x, y, x + width, y + height];
  }

  private calculateOverlap(
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

  private getBlockName(engine: CreativeEngine, blockId: number): string {
    const name = engine.block.getName(blockId);
    if (name) return name;
    const kind = engine.block.getKind(blockId);
    return kind.charAt(0).toUpperCase() + kind.slice(1);
  }

  private getRelevantBlocks(engine: CreativeEngine): number[] {
    return [
      ...engine.block.findByType('text'),
      ...engine.block.findByType('graphic')
    ];
  }

  private findOutsideBlocks(
    engine: CreativeEngine,
    page: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const pageBounds = this.getBoundingBox(engine, page);

    for (const blockId of this.getRelevantBlocks(engine)) {
      if (!engine.block.isValid(blockId)) continue;

      const blockBounds = this.getBoundingBox(engine, blockId);
      const overlap = this.calculateOverlap(blockBounds, pageBounds);

      if (overlap === 0) {
        // Element is completely outside the page
        issues.push({
          type: 'outside_page',
          severity: 'error',
          blockId,
          blockName: this.getBlockName(engine, blockId),
          message: 'Element is completely outside the visible page area'
        });
      }
    }

    return issues;
  }

  private findProtrudingBlocks(
    engine: CreativeEngine,
    page: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const pageBounds = this.getBoundingBox(engine, page);

    for (const blockId of this.getRelevantBlocks(engine)) {
      if (!engine.block.isValid(blockId)) continue;

      // Compare element bounds against page bounds
      const blockBounds = this.getBoundingBox(engine, blockId);
      const overlap = this.calculateOverlap(blockBounds, pageBounds);

      // Protruding: partially inside (overlap > 0) but not fully inside (overlap < 1)
      if (overlap > 0 && overlap < 0.99) {
        issues.push({
          type: 'protruding',
          severity: 'warning',
          blockId,
          blockName: this.getBlockName(engine, blockId),
          message: 'Element extends beyond page boundaries'
        });
      }
    }

    return issues;
  }

  private findObscuredText(
    engine: CreativeEngine,
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

        const overlap = this.calculateOverlap(
          this.getBoundingBox(engine, textId),
          this.getBoundingBox(engine, aboveId)
        );

        if (overlap > 0) {
          // Text is obscured by element above it
          issues.push({
            type: 'text_obscured',
            severity: 'warning',
            blockId: textId,
            blockName: this.getBlockName(engine, textId),
            message: 'Text may be partially hidden by overlapping elements'
          });
          break;
        }
      }
    }

    return issues;
  }

  private findUnfilledPlaceholders(engine: CreativeEngine): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const placeholders = engine.block.findAllPlaceholders();

    for (const blockId of placeholders) {
      if (!engine.block.isValid(blockId)) continue;

      if (!this.isPlaceholderFilled(engine, blockId)) {
        issues.push({
          type: 'unfilled_placeholder',
          severity: 'error',
          blockId,
          blockName: this.getBlockName(engine, blockId),
          message: 'Placeholder has not been filled with content'
        });
      }
    }

    return issues;
  }

  private isPlaceholderFilled(
    engine: CreativeEngine,
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

  private validateDesign(engine: CreativeEngine): ValidationResult {
    const page = engine.block.findByType('page')[0];

    const outsideIssues = this.findOutsideBlocks(engine, page);
    const protrudingIssues = this.findProtrudingBlocks(engine, page);
    const obscuredIssues = this.findObscuredText(engine, page);
    const placeholderIssues = this.findUnfilledPlaceholders(engine);

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

  private overrideExportAction(
    cesdk: CreativeEditorSDK,
    engine: CreativeEngine
  ): void {
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportImage.navigationBar']
    });

    const exportDesign = cesdk.actions.get('exportDesign');

    cesdk.actions.register('exportDesign', async () => {
      const result = this.validateDesign(engine);
      const hasErrors = result.errors.length > 0;
      const hasWarnings = result.warnings.length > 0;

      // Log all issues to console for debugging
      if (hasErrors || hasWarnings) {
        console.log('Validation Results:', result);
      }

      // Block export for errors
      if (hasErrors) {
        cesdk.ui.showNotification({
          message: `${result.errors.length} error(s) found - export blocked`,
          type: 'error',
          duration: 'long'
        });

        // Select first problematic block
        const firstError = result.errors[0];
        if (engine.block.isValid(firstError.blockId)) {
          engine.block.select(firstError.blockId);
        }
        return;
      }

      // Show warning but allow export
      if (hasWarnings) {
        cesdk.ui.showNotification({
          message: `${result.warnings.length} warning(s) found - proceeding with export`,
          type: 'warning',
          duration: 'medium'
        });
      }

      // Proceed with export
      exportDesign();
    });
  }
}

export default Example;
