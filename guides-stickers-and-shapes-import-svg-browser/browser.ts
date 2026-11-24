import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

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

// A badge with a radial gradient, a stroked star and a dashed line.
const badgeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <radialGradient id="glow" cx="120" cy="120" r="110" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffd166"/>
      <stop offset="1" stop-color="#ef476f"/>
    </radialGradient>
  </defs>
  <circle cx="120" cy="120" r="110" fill="url(#glow)"/>
  <polygon points="120,40 143,97 205,97 155,133 174,192 120,156 66,192 85,133 35,97 97,97"
    fill="#ffffff" stroke="#073b4c" stroke-width="6" stroke-linejoin="round"/>
  <path d="M60 212 H180" fill="none" stroke="#073b4c" stroke-width="4"
    stroke-dasharray="12 6" stroke-linecap="round"/>
</svg>`;

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

    const badge = engine.block.createFromSVG(badgeSVG);
    engine.block.appendChild(page, badge);

    // Three shapes give a group. Its children are in paint order.
    console.log(engine.block.getType(badge)); // '//ly.img.ubq/group'
    const [circle, star, line] = engine.block.getChildren(badge);
    for (const child of [circle, star, line]) {
      const shape = engine.block.getShape(child);
      console.log(engine.block.getType(shape)); // '//ly.img.ubq/shape/vector_path'
    }

    // One SVG user unit is one pixel in this scene.
    console.log(engine.scene.getDesignUnit()); // 'Pixel'

    // The group's size is readable right after the import.
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const factor =
      0.8 *
      Math.min(
        pageWidth / engine.block.getWidth(badge),
        pageHeight / engine.block.getHeight(badge)
      );
    // scale() also scales the stroke widths and dashes.
    engine.block.scale(badge, factor);
    engine.block.setPositionX(
      badge,
      (pageWidth - engine.block.getWidth(badge)) / 2
    );
    engine.block.setPositionY(
      badge,
      (pageHeight - engine.block.getHeight(badge)) / 2
    );

    // Imported shapes are graphic blocks with ordinary fills and strokes.
    const starFill = engine.block.getFill(star);
    engine.block.setColor(starFill, 'fill/color/value', {
      r: 0.02,
      g: 0.84,
      b: 0.63,
      a: 1
    });
    engine.block.setStrokeWidth(line, 12);

    try {
      engine.block.createFromSVG('<html><body>No SVG here</body></html>');
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.SVG_NOT_READABLE'
      } else {
        throw error;
      }
    }

    engine.block.select(badge);
  }
}

export default Example;
