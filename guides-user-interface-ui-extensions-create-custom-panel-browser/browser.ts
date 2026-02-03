import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

export default class CreateCustomPanelExample implements EditorPlugin {
  name = 'CreateCustomPanelExample';
  version = '1.0.0';

  async initialize(context: EditorPluginContext) {
    const { cesdk } = context;
    if (!cesdk) return;

    await cesdk.createDesignScene();

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

    cesdk.ui.setDockOrder([...cesdk.ui.getDockOrder(), 'settings-btn']);

    cesdk.ui.openPanel('my-settings');
  }
}
