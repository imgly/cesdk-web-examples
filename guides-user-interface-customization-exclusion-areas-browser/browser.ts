import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  ColorPaletteAssetSource,
  DemoAssetSources,
  PagePresetsAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

const SOURCE_ID = 'ly.img.exclusionArea';

// Served from this example's `public/` directory.
const THUMBNAIL_BASE_URL = new URL(
  `assets/${SOURCE_ID}/thumbnails`,
  new URL(import.meta.env.BASE_URL, location.href)
).href;

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());
    await cesdk.addPlugin(
      new DemoAssetSources({ include: ['ly.img.templates.print.*'] })
    );

    const engine = cesdk.engine;

    // The zone controls sit behind this key. Enabling `ly.img.page` switches on
    // every page child, including this one.
    cesdk.feature.enable(['ly.img.page.printMarks.exclusionArea']);

    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.exclusionArea.label': 'Exclusion Areas'
      }
    });

    engine.asset.addLocalSource(SOURCE_ID);

    engine.asset.addAssetToSource(SOURCE_ID, {
      id: 'ly.img.exclusionArea.rectangle',
      meta: {
        thumbUri: `${THUMBNAIL_BASE_URL}/exclusion-area-rectangle.png`,
        blockType: '//ly.img.ubq/exclusionArea',
        shapeType: '//ly.img.ubq/shape/vector_path',
        vectorPath: 'M0 0 H50 V50 H0 Z',
        width: 50,
        height: 50
      }
    });
    engine.asset.addAssetToSource(SOURCE_ID, {
      id: 'ly.img.exclusionArea.circle',
      meta: {
        thumbUri: `${THUMBNAIL_BASE_URL}/exclusion-area-circle.png`,
        blockType: '//ly.img.ubq/exclusionArea',
        shapeType: '//ly.img.ubq/shape/vector_path',
        vectorPath: 'M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z',
        width: 50,
        height: 50
      }
    });

    cesdk.ui.addAssetLibraryEntry({
      id: SOURCE_ID,
      sourceIds: [SOURCE_ID],
      previewLength: 3,
      gridColumns: 2,
      gridItemHeight: 'square',
      cardBackgroundPreferences: [{ path: 'meta.thumbUri', type: 'image' }]
    });

    // The spacer takes the leftover room, so everything after it sits at the
    // bottom of the dock. The entry goes in front of it, with the other
    // libraries, rather than below the layer list.
    const dock = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    const spacer = dock.findIndex(
      (component) =>
        typeof component !== 'string' && component.id === 'ly.img.spacer'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...dock.slice(0, spacer),
      {
        id: 'ly.img.assetLibrary.dock',
        key: SOURCE_ID,
        icon: '@imgly/ForbiddenZone',
        label: 'libraries.ly.img.exclusionArea.label',
        entries: [SOURCE_ID]
      },
      ...dock.slice(spacer)
    ]);

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const title = engine.block.create('text');
    engine.block.appendChild(page, title);
    engine.block.replaceText(title, 'Exclusion Areas');
    engine.block.setWidth(title, pageWidth);
    engine.block.setHeightMode(title, 'Auto');
    engine.block.setPositionX(title, 0);
    engine.block.setPositionY(title, pageHeight * 0.2);
    engine.block.setEnum(title, 'text/horizontalAlignment', 'Center');
    engine.block.setFloat(title, 'text/fontSize', 20);

    // A zone hangs under the page it constrains.
    const zone = engine.block.create('exclusionArea');
    engine.block.appendChild(page, zone);
    engine.block.setPositionX(zone, pageWidth * 0.55);
    engine.block.setPositionY(zone, pageHeight * 0.45);
    engine.block.setWidth(zone, pageWidth * 0.35);
    engine.block.setHeight(zone, pageHeight * 0.35);

    // A zone holds other blocks out of itself only once this is on.
    engine.block.setBool(zone, 'exclusionArea/constrains', true);

    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    engine.block.setSelected(zone, true);
  }
}

export default Example;
