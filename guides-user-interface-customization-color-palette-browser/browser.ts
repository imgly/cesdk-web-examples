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
 * CE.SDK Plugin: Color Palette Customization Guide
 *
 * This example demonstrates:
 * - Replacing the default color palette with custom brand colors
 * - Creating multiple custom color libraries
 * - Configuring which color libraries appear in the color picker
 * - Adding internationalized labels for color libraries
 * - Using different color formats (RGB, CMYK, Spot Colors)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Set up internationalized names for custom color libraries
    cesdk.i18n.setTranslations({
      en: {
        'libraries.brandPrimaryColors.label': 'Brand Primary',
        'libraries.brandSecondaryColors.label': 'Brand Secondary',
        'libraries.brandNeutralColors.label': 'Neutrals',
        'libraries.accentColors.label': 'Accent Colors'
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
      page: { width: 1200, height: 900, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create Brand Primary color library
    cesdk.engine.asset.addLocalSource('brandPrimaryColors');

    // Add brand primary colors
    cesdk.engine.asset.addAssetToSource('brandPrimaryColors', {
      id: 'brand-blue',
      label: { en: 'Brand Blue' },
      tags: { en: ['blue', 'primary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.2,
          g: 0.4,
          b: 0.8
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandPrimaryColors', {
      id: 'brand-blue-dark',
      label: { en: 'Brand Blue Dark' },
      tags: { en: ['blue', 'dark', 'primary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.1,
          g: 0.2,
          b: 0.5
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandPrimaryColors', {
      id: 'brand-blue-light',
      label: { en: 'Brand Blue Light' },
      tags: { en: ['blue', 'light', 'primary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.6,
          g: 0.7,
          b: 0.9
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandPrimaryColors', {
      id: 'brand-blue-pale',
      label: { en: 'Brand Blue Pale' },
      tags: { en: ['blue', 'pale', 'primary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.9,
          g: 0.93,
          b: 0.98
        }
      }
    });

    // Create Brand Secondary color library
    cesdk.engine.asset.addLocalSource('brandSecondaryColors');

    cesdk.engine.asset.addAssetToSource('brandSecondaryColors', {
      id: 'brand-orange',
      label: { en: 'Brand Orange' },
      tags: { en: ['orange', 'secondary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 1.0,
          g: 0.6,
          b: 0.0
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandSecondaryColors', {
      id: 'brand-orange-dark',
      label: { en: 'Brand Orange Dark' },
      tags: { en: ['orange', 'dark', 'secondary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.8,
          g: 0.4,
          b: 0.0
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandSecondaryColors', {
      id: 'brand-orange-light',
      label: { en: 'Brand Orange Light' },
      tags: { en: ['orange', 'light', 'secondary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 1.0,
          g: 0.8,
          b: 0.5
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandSecondaryColors', {
      id: 'brand-orange-pale',
      label: { en: 'Brand Orange Pale' },
      tags: { en: ['orange', 'pale', 'secondary'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 1.0,
          g: 0.95,
          b: 0.9
        }
      }
    });

    // Create Brand Neutral colors library
    cesdk.engine.asset.addLocalSource('brandNeutralColors');

    cesdk.engine.asset.addAssetToSource('brandNeutralColors', {
      id: 'neutral-black',
      label: { en: 'Black' },
      tags: { en: ['black', 'neutral'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.0,
          g: 0.0,
          b: 0.0
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandNeutralColors', {
      id: 'neutral-dark-gray',
      label: { en: 'Dark Gray' },
      tags: { en: ['gray', 'dark', 'neutral'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.3,
          g: 0.3,
          b: 0.3
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandNeutralColors', {
      id: 'neutral-gray',
      label: { en: 'Gray' },
      tags: { en: ['gray', 'neutral'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.5,
          g: 0.5,
          b: 0.5
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandNeutralColors', {
      id: 'neutral-light-gray',
      label: { en: 'Light Gray' },
      tags: { en: ['gray', 'light', 'neutral'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.85,
          g: 0.85,
          b: 0.85
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('brandNeutralColors', {
      id: 'neutral-white',
      label: { en: 'White' },
      tags: { en: ['white', 'neutral'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 1.0,
          g: 1.0,
          b: 1.0
        }
      }
    });

    // Create Accent Colors library
    cesdk.engine.asset.addLocalSource('accentColors');

    // Accent colors for special use cases
    cesdk.engine.asset.addAssetToSource('accentColors', {
      id: 'accent-green',
      label: { en: 'Accent Green' },
      tags: { en: ['green', 'accent'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.2,
          g: 0.8,
          b: 0.3
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('accentColors', {
      id: 'accent-magenta',
      label: { en: 'Accent Magenta' },
      tags: { en: ['magenta', 'accent'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.8,
          g: 0.2,
          b: 0.8
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('accentColors', {
      id: 'accent-gold',
      label: { en: 'Accent Gold' },
      tags: { en: ['gold', 'accent'] },
      payload: {
        color: {
          colorSpace: 'sRGB',
          r: 0.85,
          g: 0.65,
          b: 0.13
        }
      }
    });

    // Configure which color libraries appear in the color picker
    // The order in sourceIds determines the display order in the UI
    cesdk.ui.updateAssetLibraryEntry('ly.img.colors', {
      sourceIds: [
        'brandPrimaryColors',
        'brandSecondaryColors',
        'brandNeutralColors',
        'accentColors'
        // Note: 'ly.img.colors.defaultPalette' is intentionally omitted
        // to replace the default palette completely
      ]
    });

    // Create a rounded rectangle shape to demonstrate the custom color palette
    // The shape will be selected on startup, opening the fill panel
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create graphic block with rounded rectangle shape
    const block = engine.block.create('graphic');
    const shape = engine.block.createShape('rect');
    engine.block.setShape(block, shape);

    // Set dimensions (400x300)
    engine.block.setWidth(block, 400);
    engine.block.setHeight(block, 300);

    // Apply Brand Blue fill
    const fill = engine.block.createFill('color');
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(block, fill);

    // Add to page and center
    engine.block.appendChild(page, block);
    engine.block.setPositionX(block, (pageWidth - 400) / 2);
    engine.block.setPositionY(block, (pageHeight - 300) / 2);

    // Zoom to the shape
    await engine.scene.zoomToBlock(block, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
    //

    // Select block
    engine.block.select(block);

    // Opens fill inspector
    cesdk.ui.openPanel('//ly.img.panel/inspector/fill');
  }
}

export default Example;
