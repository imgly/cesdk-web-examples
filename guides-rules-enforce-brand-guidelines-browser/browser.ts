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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Enforce Brand Guidelines Guide
 *
 * Demonstrates how to restrict users to approved brand assets and prevent
 * unauthorized modifications to brand elements using asset restrictions
 * and the scopes system.
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Set up internationalized names for custom asset libraries
    cesdk.i18n.setTranslations({
      en: {
        'libraries.brandColors.label': 'Brand Colors',
        'libraries.brandFonts.label': 'Brand Fonts'
      }
    });
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

    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 800, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create brand color source with approved colors only
    engine.asset.addLocalSource('brandColors');

    engine.asset.addAssetToSource('brandColors', {
      id: 'brand-primary',
      label: { en: 'Brand Blue' },
      payload: {
        color: { colorSpace: 'sRGB', r: 0.2, g: 0.4, b: 0.8 }
      }
    });

    engine.asset.addAssetToSource('brandColors', {
      id: 'brand-secondary',
      label: { en: 'Brand Orange' },
      payload: {
        color: { colorSpace: 'sRGB', r: 1.0, g: 0.6, b: 0.0 }
      }
    });

    engine.asset.addAssetToSource('brandColors', {
      id: 'brand-neutral-dark',
      label: { en: 'Dark Gray' },
      payload: {
        color: { colorSpace: 'sRGB', r: 0.2, g: 0.2, b: 0.2 }
      }
    });

    engine.asset.addAssetToSource('brandColors', {
      id: 'brand-neutral-light',
      label: { en: 'Light Gray' },
      payload: {
        color: { colorSpace: 'sRGB', r: 0.9, g: 0.9, b: 0.9 }
      }
    });

    engine.asset.addAssetToSource('brandColors', {
      id: 'brand-white',
      label: { en: 'White' },
      payload: {
        color: { colorSpace: 'sRGB', r: 1.0, g: 1.0, b: 1.0 }
      }
    });

    // Replace default color palette with brand colors only
    cesdk.ui.updateAssetLibraryEntry('ly.img.colors', {
      sourceIds: ['brandColors']
    });

    // Create brand font source with approved typefaces
    engine.asset.addLocalSource('brandFonts');

    engine.asset.addAssetToSource('brandFonts', {
      id: 'brand-heading-font',
      label: { en: 'Montserrat' },
      payload: {
        typeface: {
          name: 'Montserrat',
          fonts: [
            {
              uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Montserrat/Montserrat-Regular.ttf',
              subFamily: 'Regular',
              weight: 'normal',
              style: 'normal'
            },
            {
              uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Montserrat/Montserrat-Bold.ttf',
              subFamily: 'Bold',
              weight: 'bold',
              style: 'normal'
            }
          ]
        }
      }
    });

    engine.asset.addAssetToSource('brandFonts', {
      id: 'brand-body-font',
      label: { en: 'Open Sans' },
      payload: {
        typeface: {
          name: 'Open Sans',
          fonts: [
            {
              uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/OpenSans/OpenSans-Regular.ttf',
              subFamily: 'Regular',
              weight: 'normal',
              style: 'normal'
            },
            {
              uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/OpenSans/OpenSans-Bold.ttf',
              subFamily: 'Bold',
              weight: 'bold',
              style: 'normal'
            }
          ]
        }
      }
    });

    // Replace default font library with brand fonts only
    cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
      sourceIds: ['brandFonts']
    });

    // Set global scopes to Defer for block-level control
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');
    engine.editor.setGlobalScope('fill/change', 'Defer');
    engine.editor.setGlobalScope('fill/changeType', 'Defer');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    engine.editor.setGlobalScope('lifecycle/duplicate', 'Defer');
    engine.editor.setGlobalScope('text/edit', 'Defer');

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

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
      a: 1.0
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
      a: 1.0
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

    // Create editable text that uses brand fonts
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

    // Enable text editing with brand font restrictions
    engine.block.setScopeEnabled(editableText, 'layer/move', true);
    engine.block.setScopeEnabled(editableText, 'layer/resize', true);
    engine.block.setScopeEnabled(editableText, 'text/edit', true);
    engine.block.setScopeEnabled(editableText, 'lifecycle/destroy', true);

    // Validate brand compliance
    const isLogoLocked = !engine.block.isAllowedByScope(
      logoBlock,
      'layer/move'
    );
    const isLegalLocked = !engine.block.isAllowedByScope(
      legalText,
      'text/edit'
    );
    const isContentEditable = engine.block.isAllowedByScope(
      contentBlock,
      'fill/change'
    );

    console.log(`Logo is locked: ${isLogoLocked}`);
    console.log(`Legal text is locked: ${isLegalLocked}`);
    console.log(`Content block is editable: ${isContentEditable}`);

    // Select the editable content block and zoom to page
    engine.block.select(contentBlock);
    await engine.scene.zoomToBlock(page, {
      padding: { left: 40, top: 40, right: 40, bottom: 40 }
    });

    // Open fill panel to show brand color restriction
    cesdk.ui.openPanel('//ly.img.panel/inspector/fill');
  }
}

export default Example;
