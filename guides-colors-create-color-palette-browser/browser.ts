import type {
  AssetDefinition,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

// Define color assets for each color space type
const colors: AssetDefinition[] = [
  {
    id: 'brand-blue',
    label: { en: 'Brand Blue' },
    tags: { en: ['brand', 'blue', 'primary'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 0.2,
        g: 0.4,
        b: 0.8
      }
    }
  },
  {
    id: 'brand-coral',
    label: { en: 'Brand Coral' },
    tags: { en: ['brand', 'coral', 'secondary'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 0.95,
        g: 0.45,
        b: 0.4
      }
    }
  },
  {
    id: 'print-magenta',
    label: { en: 'Print Magenta' },
    tags: { en: ['print', 'magenta', 'cmyk'] },
    payload: {
      color: {
        colorSpace: 'CMYK',
        c: 0,
        m: 0.9,
        y: 0.2,
        k: 0
      }
    }
  },
  {
    id: 'metallic-gold',
    label: { en: 'Metallic Gold' },
    tags: { en: ['spot', 'metallic', 'gold'] },
    payload: {
      color: {
        colorSpace: 'SpotColor',
        name: 'Metallic Gold Ink',
        externalReference: 'Custom Inks',
        representation: {
          colorSpace: 'sRGB',
          r: 0.85,
          g: 0.65,
          b: 0.13
        }
      }
    }
  }
];

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Set labels for the color library using i18n
    cesdk.i18n.setTranslations({
      en: {
        'libraries.my-brand-colors.label': 'Brand Colors'
      }
    });

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a local asset source for the color library
    engine.asset.addLocalSource('my-brand-colors');

    // Add all color assets to the source
    for (const color of colors) {
      engine.asset.addAssetToSource('my-brand-colors', color);
    }

    // Configure the color picker to display the custom library
    cesdk.ui.updateAssetLibraryEntry('ly.img.colors', {
      sourceIds: ['ly.img.colors.defaultPalette', 'my-brand-colors']
    });

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    // Set up the page with dimensions
    const page = engine.block.findByType('page')[0];

    // Apply a soft cream background to the page fill
    // This complements the Brand Blue rectangle
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.98,
      g: 0.96,
      b: 0.92,
      a: 1.0
    });

    // Create a graphic block with Brand Blue from the custom palette
    const block = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      block,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const fill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Use Brand Blue from our custom palette
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(block, fill);
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 200);

    // Center the block on the page
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    engine.block.setPositionX(block, (pageWidth - 200) / 2);
    engine.block.setPositionY(block, (pageHeight - 200) / 2);
    engine.block.appendChild(page, block);

    // Select the block and open the fill inspector to show the color picker
    engine.block.select(block);
    cesdk.ui.openPanel('//ly.img.panel/inspector/fill');

    console.log('Create Color Palette example loaded successfully');
  }
}

export default Example;
