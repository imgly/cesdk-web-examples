import CreativeEngine, {
  AssetDefinition,
  AssetRGBColor,
  AssetCMYKColor,
  AssetSpotColor
} from '@cesdk/node';
import * as fs from 'fs';

async function main() {
  let engine;
  try {
    engine = await CreativeEngine.init({
      // license: 'YOUR_CESDK_LICENSE_KEY'
    });
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

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
          } as AssetRGBColor
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
          } as AssetRGBColor
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
          } as AssetCMYKColor
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
          } as AssetSpotColor
        }
      }
    ];

    // Create a local asset source for the color library
    engine.asset.addLocalSource('my-brand-colors');

    // Add all color assets to the source
    for (const color of colors) {
      engine.asset.addAssetToSource('my-brand-colors', color);
    }

    // Query colors from the library
    const queryResult = await engine.asset.findAssets('my-brand-colors', {
      page: 0,
      perPage: 100
    });
    console.log('Colors in library:', queryResult.assets.length);
    for (const asset of queryResult.assets) {
      console.log(`  - ${asset.id}: ${asset.label ?? 'No label'}`);
    }

    // Remove a color from the library
    engine.asset.removeAssetFromSource('my-brand-colors', 'brand-coral');
    console.log('Removed brand-coral from library');

    // Verify removal
    const updatedResult = await engine.asset.findAssets('my-brand-colors', {
      page: 0,
      perPage: 100
    });
    console.log('Colors after removal:', updatedResult.assets.length);

    // Create a graphic block and apply a color from the palette
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 300);
    engine.block.setPositionY(block, 225);
    engine.block.appendChild(page, block);

    // Apply Brand Blue from our palette
    const fill = engine.block.getFill(block);
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Export the scene
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('output.png', buffer);
    console.log('Exported scene to output.png');
  } finally {
    if (engine) {
      engine.dispose();
    }
  }
}

main().catch(console.error);
