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

export default class CreateCustomPanelExample implements EditorPlugin {
  name = 'CreateCustomPanelExample';
  version = '1.0.0';

  async initialize(context: EditorPluginContext) {
    const { cesdk } = context;
    if (!cesdk) return;

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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    cesdk.i18n.setTranslations({
      en: { 'panel.my-settings': 'My Settings Panel' }
    });

    cesdk.ui.registerPanel('my-settings', ({ builder, engine, state }) => {

      const textState = state('text', 'Hello CE.SDK');
      const opacityState = state('opacity', 100);

      builder.Section('settings', {
        title: 'Settings',
        children: () => {

          builder.TextInput('name', {
            inputLabel: 'Name',
            ...textState
          });

          builder.Slider('opacity', {
            inputLabel: 'Opacity',
            min: 0,
            max: 100,
            ...opacityState
          });

          builder.Checkbox('enabled', {
            inputLabel: 'Enable feature',
            value: true,
            setValue: () => {}
          });

          builder.Button('apply', {
            label: 'Apply',
            onClick: () => {

              const page = engine.block.findByType('page')[0];
              engine.block.setOpacity(page, opacityState.value / 100);
            }
          });

          const selected = engine.block.findAllSelected();
          if (selected.length > 0) {
            builder.Text('info', { content: `${selected.length} selected` });
          }
        }
      });
    });

    cesdk.ui.registerComponent('settings-btn', ({ builder }) => {
      builder.Button('toggle', {
        label: 'Settings',
        icon: '@imgly/Settings',
        isActive: cesdk.ui.isPanelOpen('my-settings'),
        onClick: () => cesdk.ui.openPanel('my-settings')
      });
    });

    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'settings-btn'
    ]);

    cesdk.ui.openPanel('my-settings');
  }
}
