import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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

export default class CreateCustomPanelExample implements EditorPlugin {
  name = 'CreateCustomPanelExample';
  version = '1.0.0';

  async initialize(context: EditorPluginContext) {
    const { cesdk } = context;
    if (!cesdk) return;

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

    cesdk.i18n.setTranslations({
      en: { 'panel.my-settings': 'My Settings Panel' }
    });

    cesdk.ui.registerPanel('my-settings', ({ builder, engine, state }) => {

      const textState = state('text', 'Hello CE.SDK');
      const opacityState = state('opacity', 100);
      const spacingState = state('spacing', 8);
      const headlineState = state('headline', 'Product name');
      const viewState = state('view', 'content');
      const enabledState = state('enabled', true);
      const shadowState = state('shadow', false);

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

          builder.NumberInput('spacing', {
            inputLabel: 'Spacing',
            min: 0,
            max: 64,
            step: 4,
            showStepper: true,
            ...spacingState
          });

          builder.Checkbox('enabled', {
            inputLabel: 'Enable feature',
            ...enabledState
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

      builder.Section('view', {
        children: () => {
          builder.Tabs('view-tabs', {
            inputLabel: 'View',
            inputLabelPosition: 'top',
            ...viewState,
            tabs: [
              {
                id: 'content',
                label: 'Content',
                icon: '@imgly/Text',
                children: () => {
                  builder.TextInput('headline', {
                    inputLabel: 'Headline',
                    ...headlineState
                  });
                }
              },
              {
                id: 'style',
                label: 'Style',
                icon: '@imgly/Appearance',
                isActive: opacityState.value < 100,
                children: () => {
                  builder.Checkbox('shadow', {
                    inputLabel: 'Drop shadow',
                    ...shadowState
                  });
                }
              }
            ]
          });
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
