import type {
  EditorPlugin,
  EditorPluginContext,
  FeatureDefinition,
  FeatureShapeOf
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

// Declare the feature once. Settings are JSON Schema with a default.
const stampFeature = {
  id: 'my.guide.stamp',
  title: 'Stamp',
  description: 'Stamping a block with a label.',
  requires: ({ engine, blockId }) =>
    blockId != null && engine.block.supportsFill(blockId),
  labels: {
    type: 'array',
    items: { enum: ['Draft', 'Approved', 'Rejected'] },
    default: ['Draft', 'Approved', 'Rejected']
  }
} as const satisfies FeatureDefinition;

// TypeScript accepts only registered ids, so add the feature to the registry.
declare module '@cesdk/cesdk-js' {
  interface FeatureRegistry {
    'my.guide.stamp': FeatureShapeOf<typeof stampFeature>;
  }
}

/**
 * Disable or Enable Features Example
 *
 * This example demonstrates how to use CE.SDK's `cesdk.features` API to:
 * - Switch features on and options off
 * - Change settings and narrow or extend where a feature shows
 * - Read, explain and inspect features
 * - Define a feature for a custom component
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // The editor starts empty. The editor configuration switches on what it offers.
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setFill(page, gradientFill);
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.99, g: 0.98, b: 0.97, a: 1 }, stop: 0 },
      { color: { r: 0.97, g: 0.96, b: 0.94, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);

    const titleBlock = engine.block.create('text');
    engine.block.appendChild(page, titleBlock);
    engine.block.replaceText(titleBlock, 'Disable or Enable Features');
    engine.block.setTextFontSize(titleBlock, 24);
    engine.block.setTextColor(titleBlock, { r: 0.25, g: 0.22, b: 0.2, a: 1 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setPositionX(titleBlock, pageWidth * 0.1);
    engine.block.setPositionY(titleBlock, pageHeight * 0.4);

    const subtitleBlock = engine.block.create('text');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.replaceText(subtitleBlock, 'IMG.LY');
    engine.block.setTextFontSize(subtitleBlock, 12);
    engine.block.setTextColor(subtitleBlock, {
      r: 0.65,
      g: 0.45,
      b: 0.4,
      a: 1
    });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleBlock, pageWidth * 0.8);
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.setPositionX(subtitleBlock, pageWidth * 0.1);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.52);

    // Built-in features start off. Switch on the ones this editor offers.
    cesdk.features.configure({
      'ly.img.preview': { enabled: true },
      'ly.img.rulers': { enabled: true }
    });

    // Options start on. Switch off the ones the editor should not offer.
    cesdk.features.configure({
      'ly.img.text': {
        options: {
          decoration: { enabled: false },
          path: { enabled: false }
        }
      }
    });

    // A setting takes a value, or a function that gets the value before it.
    cesdk.features.configure({
      'ly.img.crop': { open: 'manual' },
      'ly.img.text': {
        options: {
          fontSize: { presets: [12, 14, 18, 24, 36] },
          alignment: {
            alignments: ({ previous }) =>
              previous.filter((alignment) => alignment !== 'Auto')
          }
        }
      }
    });

    // A rule replaces the built-in one. Opacity is for creators, on a single block.
    cesdk.features.configure({
      'ly.img.opacity': {
        when: ({ engine, selection }) =>
          selection.length === 1 && engine.editor.getRole() === 'Creator'
      }
    });

    // A narrow adds a condition that must hold. Locked blocks cannot be deleted.
    engine.block.setMetadata(subtitleBlock, 'locked', 'true');
    cesdk.features.configure({
      'ly.img.delete': {
        when: {
          narrow: ({ engine, blockId }) =>
            blockId == null || !engine.block.hasMetadata(blockId, 'locked')
        }
      }
    });

    // An extend adds a place where the feature shows. Fill now also shows for stickers.
    cesdk.features.configure({
      'ly.img.fill': {
        when: {
          extend: ({ engine, blockId, selection }) =>
            selection.length === 1 &&
            blockId != null &&
            engine.block.getKind(blockId) === 'sticker'
        }
      }
    });

    // evaluate works a feature out for a block: a status per level and the final settings.
    const text = cesdk.features.evaluate('ly.img.text', {
      blockId: titleBlock
    });
    console.log('Text:', text.status);
    console.log('Decoration:', text.options.decoration.status);
    console.log('Font sizes:', text.options.fontSize.presets);

    // explain says why a level is not available, and who decided it.
    const reason = cesdk.features.explain('ly.img.delete', {
      blockId: subtitleBlock
    });
    console.log('Delete:', reason.status, reason.reason, reason.rule);

    // get returns the feature as configured, list returns all of them. No rule runs.
    const crop = cesdk.features.get('ly.img.crop');
    console.log('Crop switched on:', crop.enabled);
    console.log('Crop opens:', crop.open.value);
    console.log(
      'All features:',
      cesdk.features.list().map((feature) => feature.id)
    );

    // Define the feature before anything configures it.
    cesdk.features.define(stampFeature);
    cesdk.features.configure({
      'my.guide.stamp': {
        enabled: true,
        labels: ['Draft', 'Approved']
      }
    });

    // The component re-renders when the feature changes.
    cesdk.ui.registerComponent(
      'my.guide.stamp.canvasMenu',
      ({ builder, engine }) => {
        const [blockId] = engine.block.findAllSelected();
        const stamp = cesdk.features.evaluate('my.guide.stamp', { blockId });
        if (stamp.status !== 'available') return;

        builder.ButtonGroup('stamp-labels', {
          children: () => {
            stamp.labels.forEach((label) => {
              builder.Button(`stamp-${label}`, {
                label,
                onClick: () => engine.block.setName(blockId, label)
              });
            });
          }
        });
      }
    );
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.canvas.menu', position: 'end' },
      'my.guide.stamp.canvasMenu'
    );

    engine.block.select(titleBlock);

    console.log('Disable or Enable Features example loaded successfully!');
  }
}

export default Example;
