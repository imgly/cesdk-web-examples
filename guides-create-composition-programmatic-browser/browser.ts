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
 * CE.SDK Plugin: Programmatic Creation Guide
 *
 * Demonstrates building compositions entirely through code:
 * - Creating scenes and pages with social media dimensions
 * - Setting page background colors
 * - Adding text blocks with mixed styling (bold, italic, colors)
 * - Adding line shapes as dividers
 * - Adding images
 * - Positioning and sizing blocks
 */

// Roboto typeface with all variants for mixed styling
const ROBOTO_TYPEFACE = {
  name: 'Roboto',
  fonts: [
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf',
      subFamily: 'Regular'
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
      subFamily: 'Bold',
      weight: 'bold' as const
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf',
      subFamily: 'Italic',
      style: 'italic' as const
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf',
      subFamily: 'Bold Italic',
      weight: 'bold' as const,
      style: 'italic' as const
    }
  ]
};

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

    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const scene = engine.scene.get()!;

    engine.block.setFloat(scene, 'scene/dpi', 300);
    const page = engine.block.findByType('page')[0];

    // Set page background to light lavender color
    const backgroundFill = engine.block.createFill('color');
    engine.block.setColor(backgroundFill, 'fill/color/value', {
      r: 0.94,
      g: 0.93,
      b: 0.98,
      a: 1.0
    });
    engine.block.setFill(page, backgroundFill);

    // Add main headline text with bold Roboto font
    const headline = engine.block.create('text');
    engine.block.replaceText(
      headline,
      'Integrate\nCreative Editing\ninto your App'
    );
    engine.block.setFont(
      headline,
      ROBOTO_TYPEFACE.fonts[0].uri,
      ROBOTO_TYPEFACE
    );
    engine.block.setFloat(headline, 'text/lineHeight', 0.78);

    // Make headline bold
    if (engine.block.canToggleBoldFont(headline)) {
      engine.block.toggleBoldFont(headline);
    }
    engine.block.setTextColor(headline, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

    // Set fixed container size and enable automatic font sizing
    engine.block.setWidthMode(headline, 'Absolute');
    engine.block.setHeightMode(headline, 'Absolute');
    engine.block.setWidth(headline, 960);
    engine.block.setHeight(headline, 300);
    engine.block.setBool(headline, 'text/automaticFontSizeEnabled', true);

    engine.block.setPositionX(headline, 60);
    engine.block.setPositionY(headline, 80);
    engine.block.appendChild(page, headline);

    // Add tagline with mixed styling using range-based APIs
    // "in hours," (purple italic) + "not months." (black bold)
    const tagline = engine.block.create('text');
    const taglineText = 'in hours,\nnot months.';
    engine.block.replaceText(tagline, taglineText);

    // Set up Roboto typeface with all variants for mixed styling
    engine.block.setFont(
      tagline,
      ROBOTO_TYPEFACE.fonts[0].uri,
      ROBOTO_TYPEFACE
    );
    engine.block.setFloat(tagline, 'text/lineHeight', 0.78);

    // Style "in hours," - purple and italic (characters 0-9)
    engine.block.setTextColor(
      tagline,
      { r: 0.2, g: 0.2, b: 0.8, a: 1.0 },
      0,
      9
    );
    if (engine.block.canToggleItalicFont(tagline, 0, 9)) {
      engine.block.toggleItalicFont(tagline, 0, 9);
    }

    // Style "not months." - black and bold (characters 10-21)
    engine.block.setTextColor(
      tagline,
      { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      10,
      21
    );
    if (engine.block.canToggleBoldFont(tagline, 10, 21)) {
      engine.block.toggleBoldFont(tagline, 10, 21);
    }

    // Set fixed container size and enable automatic font sizing
    engine.block.setWidthMode(tagline, 'Absolute');
    engine.block.setHeightMode(tagline, 'Absolute');
    engine.block.setWidth(tagline, 960);
    engine.block.setHeight(tagline, 220);
    engine.block.setBool(tagline, 'text/automaticFontSizeEnabled', true);
    engine.block.setPositionX(tagline, 60);
    engine.block.setPositionY(tagline, 551);
    engine.block.appendChild(page, tagline);

    // Add CTA text "Start a Free Trial" with bold font
    const ctaTitle = engine.block.create('text');
    engine.block.replaceText(ctaTitle, 'Start a Free Trial');
    engine.block.setFont(
      ctaTitle,
      ROBOTO_TYPEFACE.fonts[0].uri,
      ROBOTO_TYPEFACE
    );
    engine.block.setFloat(ctaTitle, 'text/fontSize', 80);
    engine.block.setFloat(ctaTitle, 'text/lineHeight', 1.0);

    if (engine.block.canToggleBoldFont(ctaTitle)) {
      engine.block.toggleBoldFont(ctaTitle);
    }
    engine.block.setTextColor(ctaTitle, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

    engine.block.setWidthMode(ctaTitle, 'Absolute');
    engine.block.setHeightMode(ctaTitle, 'Auto');
    engine.block.setWidth(ctaTitle, 664.6);
    engine.block.setPositionX(ctaTitle, 64);
    engine.block.setPositionY(ctaTitle, 952);
    engine.block.appendChild(page, ctaTitle);

    // Add website URL with regular font
    const ctaUrl = engine.block.create('text');
    engine.block.replaceText(ctaUrl, 'www.img.ly');
    engine.block.setFont(ctaUrl, ROBOTO_TYPEFACE.fonts[0].uri, ROBOTO_TYPEFACE);
    engine.block.setFloat(ctaUrl, 'text/fontSize', 80);
    engine.block.setFloat(ctaUrl, 'text/lineHeight', 1.0);
    engine.block.setTextColor(ctaUrl, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 });

    engine.block.setWidthMode(ctaUrl, 'Absolute');
    engine.block.setHeightMode(ctaUrl, 'Auto');
    engine.block.setWidth(ctaUrl, 664.6);
    engine.block.setPositionX(ctaUrl, 64);
    engine.block.setPositionY(ctaUrl, 1006);
    engine.block.appendChild(page, ctaUrl);

    // Add horizontal divider line
    const dividerLine = engine.block.create('graphic');
    const lineShape = engine.block.createShape('line');
    engine.block.setShape(dividerLine, lineShape);

    const lineFill = engine.block.createFill('color');
    engine.block.setColor(lineFill, 'fill/color/value', {
      r: 0.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(dividerLine, lineFill);

    engine.block.setWidth(dividerLine, 418);
    engine.block.setHeight(dividerLine, 11.3);
    engine.block.setPositionX(dividerLine, 64);
    engine.block.setPositionY(dividerLine, 460);
    engine.block.appendChild(page, dividerLine);

    // Add IMG.LY logo image
    const logo = engine.block.create('graphic');
    const logoShape = engine.block.createShape('rect');
    engine.block.setShape(logo, logoShape);

    const logoFill = engine.block.createFill('image');
    engine.block.setString(
      logoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(logo, logoFill);

    engine.block.setContentFillMode(logo, 'Contain');
    engine.block.setWidth(logo, 200);
    engine.block.setHeight(logo, 65);
    engine.block.setPositionX(logo, 820);
    engine.block.setPositionY(logo, 960);
    engine.block.appendChild(page, logo);

    // Export the composition to PNG
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1080
    });

    // In browser, create a download link
    const url = URL.createObjectURL(blob);
    console.log('Export complete. Download URL:', url);

    // Zoom to show the page
    await cesdk.actions.run('zoom.toPage', { autoFit: true });
  }
}

export default Example;
