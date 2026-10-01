import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
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
 * CE.SDK Plugin: Layer & Page List Guide
 *
 * Configures the layer and page list: which parts of it exist, where it opens,
 * what it shows, and which commands each row's menu offers.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.templates.blank.*', 'ly.img.image.*']
      })
    );

    // Three pages, so the Pages section has more than one row to show.
    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' },
      pageCount: 3
    });

    await this.addBlocksToFirstPage(cesdk);

    // The list is a panel like any other, so the Panel API opens it.
    cesdk.ui.openPanel('//ly.img.panel/layers');

    // Place it beside the canvas rather than floating over it.
    cesdk.ui.setPanelPosition('//ly.img.panel/layers', 'left');
    cesdk.ui.setPanelFloating('//ly.img.panel/layers', false);

    // The pages sit above the current page's layers. `combined` would replace
    // both with one tree of every page and its layers.
    cesdk.feature.enable('ly.img.layerList.pages');
    cesdk.feature.enable('ly.img.layerList.layers');
    // cesdk.feature.enable('ly.img.layerList.combined');

    // By default picking a page row scrolls the canvas to it and picking a
    // layer row leaves the canvas alone. `true` follows every row; `disable`
    // follows none.
    cesdk.feature.set('ly.img.layerList.canvasFollow', true);

    // Without a `when` clause the layer row order is returned.
    const layerMenu = cesdk.ui.getComponentOrder({
      in: 'ly.img.layerList.menu'
    });
    // eslint-disable-next-line no-console
    console.log('Default layer row menu:', layerMenu);

    const pageMenu = cesdk.ui.getComponentOrder({
      in: 'ly.img.layerList.menu',
      when: { rowKind: 'page' }
    });
    // eslint-disable-next-line no-console
    console.log('Default page row menu:', pageMenu);

    // Drop the four arrange commands from a layer row's menu. Dragging a row
    // and the bracket shortcuts still reorder blocks.
    (
      [
        'ly.img.layerList.menu.bringToFront',
        'ly.img.layerList.menu.bringForward',
        'ly.img.layerList.menu.sendBackward',
        'ly.img.layerList.menu.sendToBack'
      ] as const
    ).forEach((match) => {
      cesdk.ui.removeOrderComponent({ in: 'ly.img.layerList.menu', match });
    });

    // A custom entry is a registered component like any other.
    cesdk.ui.registerComponent(
      'ly.img.layerList.menu.copyName',
      ({ builder, engine }) => {
        const [block] = engine.block.findAllSelected();
        builder.Button('ly.img.layerList.menu.copyName', {
          label: 'Copy Name',
          icon: '@imgly/Copy',
          isDisabled: block == null,
          onClick: () => {
            if (block == null) return;
            void navigator.clipboard.writeText(engine.block.getName(block));
          }
        });
      }
    );

    // Page rows only, so a layer row's menu is left alone.
    cesdk.ui.insertOrderComponent(
      {
        in: 'ly.img.layerList.menu',
        when: { rowKind: 'page' },
        after: 'ly.img.layerList.menu.delete'
      },
      'ly.img.layerList.menu.copyName'
    );

    // Each row control has its own key, so turning one off leaves the rest of
    // the list working.
    cesdk.feature.disable('ly.img.layerList.lock');
  }

  /** Gives the Layers section a group and a couple of leaf rows to show. */
  private async addBlocksToFirstPage(
    cesdk: NonNullable<EditorPluginContext['cesdk']>
  ): Promise<void> {
    const { engine } = cesdk;
    const [page] = engine.scene.getPages();

    const title = engine.block.create('text');
    engine.block.setName(title, 'Headline');
    engine.block.replaceText(title, 'Layer & Page List');
    engine.block.setPositionX(title, 80);
    engine.block.setPositionY(title, 80);
    engine.block.setWidth(title, 920);
    engine.block.setHeight(title, 160);
    engine.block.setFloat(title, 'text/fontSize', 96);
    engine.block.appendChild(page, title);

    const shapes = (
      [
        { shape: 'rect', name: 'Backdrop', x: 180, color: [0.2, 0.4, 0.9] },
        { shape: 'ellipse', name: 'Badge', x: 500, color: [0.95, 0.6, 0.2] }
      ] as const
    ).map(({ shape, name, x, color }) => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape(shape));
      const fill = engine.block.createFill('color');
      const [r, g, b] = color;
      engine.block.setColor(fill, 'fill/color/value', { r, g, b, a: 1 });
      engine.block.setFill(block, fill);
      engine.block.setName(block, name);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, 380);
      engine.block.setWidth(block, 280);
      engine.block.setHeight(block, 280);
      engine.block.appendChild(page, block);
      return block;
    });

    // A group gives the list a row that opens to reveal what is inside it.
    const group = engine.block.group(shapes);
    engine.block.setName(group, 'Artwork');

    // Selecting the group makes the first page the one the Layers section
    // shows, with the group's row open.
    engine.block.select(group);

    engine.editor.addUndoStep();
  }
}

export default Example;
