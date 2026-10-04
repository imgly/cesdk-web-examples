import type CreativeEditorSDK from '@cesdk/cesdk-js';

export function configureEditor(cesdk: CreativeEditorSDK) {
  cesdk.ui.setTheme('light');
  cesdk.ui.setView('default');
  cesdk.ui.closePanel('*');
  cesdk.feature.enable([
    'ly.img.dock',
    'ly.img.library.panel',
    'ly.img.navigation.bar',
    'ly.img.navigation.undoRedo',
    'ly.img.navigation.zoom',
    'ly.img.inspector.bar',
    'ly.img.canvas.menu',
    'ly.img.keyboard.shortcuts',
    'ly.img.delete',
    'ly.img.duplicate',
    'ly.img.group.*',
    'ly.img.position.*',
    'ly.img.transform.*',
    'ly.img.fill.color.*',
    'ly.img.stroke.*',
    'ly.img.opacity',
    'ly.img.blendMode',
    'ly.img.text.edit',
    'ly.img.text.fontSize',
    'ly.img.text.alignment',
    'ly.img.text.advanced',
    'ly.img.text.decoration'
  ]);
  registerLayersPanel(cesdk);
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    'ly.img.undoRedo.navigationBar',
    'ly.img.spacer',
    'ly.img.title.navigationBar',
    'ly.img.spacer',
    'ly.img.zoom.navigationBar'
  ]);
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'eps-layers',
      icon: '@imgly/LayerBringForwardArrow',
      label: 'Layers',
      entries: [],
      isSelected: () => cesdk.ui.isPanelOpen('eps-layers'),
      onClick: () => {
        if (cesdk.ui.isPanelOpen('eps-layers')) {
          cesdk.ui.closePanel('eps-layers');
        } else {
          cesdk.ui.openPanel('eps-layers');
        }
      }
    }
  ]);
  const appearance = [
    'ly.img.fill.inspectorBar',
    'ly.img.stroke.inspectorBar',
    'ly.img.opacityOptions.inspectorBar'
  ];
  const text = [
    'ly.img.text.fontSize.inspectorBar',
    'ly.img.text.alignHorizontal.inspectorBar',
    'ly.img.text.advanced.inspectorBar'
  ];
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Transform' } },
    [
      'ly.img.spacer',
      'ly.img.group.create.inspectorBar',
      'ly.img.group.ungroup.inspectorBar',
      ...text,
      ...appearance,
      'ly.img.position.inspectorBar',
      'ly.img.spacer'
    ]
  );
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
    ['ly.img.spacer', ...text, ...appearance, 'ly.img.spacer']
  );
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
    [
      'ly.img.group.enter.canvasMenu',
      'ly.img.group.select.canvasMenu',
      'ly.img.text.edit.canvasMenu',
      'ly.img.separator',
      'ly.img.bringForward.canvasMenu',
      'ly.img.sendBackward.canvasMenu',
      'ly.img.separator',
      'ly.img.duplicate.canvasMenu',
      'ly.img.delete.canvasMenu'
    ]
  );
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.menu', when: { editMode: 'Text' } },
    [
      'ly.img.text.color.canvasMenu',
      'ly.img.text.underline.canvasMenu',
      'ly.img.text.strikethrough.canvasMenu'
    ]
  );
}

// Use the public panel builder so this showcase also works with editor releases
// that predate the native Layers panel.
function registerLayersPanel(cesdk: CreativeEditorSDK) {
  cesdk.i18n.setTranslations({ en: { 'panel.eps-layers': 'Layers' } });
  cesdk.ui.registerPanel('eps-layers', ({ builder, engine }) => {
    const { block, editor, scene } = engine;
    const page = scene.getCurrentPage();
    if (page == null) return;
    const selected = block.findAllSelected();
    if (selected.length === 1 && selected[0] !== page) {
      const id = selected[0];
      builder.Section('selected-layer', {
        title: 'Selected object',
        children: () => {
          builder.TextInput('layer-name', {
            inputLabel: 'Name',
            value: block.getName(id),
            setValue: (name) => {
              block.setName(id, name);
              editor.addUndoStep();
            }
          });
          builder.Checkbox('layer-visible', {
            inputLabel: 'Visible',
            value: block.isVisible(id),
            setValue: (visible) => {
              block.setVisible(id, visible);
              editor.addUndoStep();
            }
          });
        }
      });
    }
    builder.Section('page-layers', {
      title: 'Objects · front to back',
      children: () => {
        const renderChildren = (parent: number, depth: number) => {
          [...block.getChildren(parent)].reverse().forEach((id) => {
            // Keep the source-frame helper out of user-facing layers.
            if (block.hasMetadata(id, 'ly.img.pdf-importer.pageBounds')) {
              return;
            }
            const name =
              block.getName(id) || block.getType(id).split('/').pop();
            builder.Button(`layer-${id}`, {
              label: `${'↳ '.repeat(depth)}${name}`,
              labelAlignment: 'left',
              isSelected: selected.includes(id),
              onClick: () => block.select(id)
            });
            renderChildren(id, depth + 1);
          });
        };
        renderChildren(page, 0);
      }
    });
  });
}
