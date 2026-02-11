import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

const registerNewComponentPlugin: EditorPlugin = {
  name: 'ly.img.registerNewComponentPlugin',
  version: '1.0.0',

  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (cesdk == null) return;

    // Load a scene so the editor has content to display
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Register a custom button component that shows the selected block's type.
    // The render function is automatically re-invoked when engine state changes.
    cesdk.ui.registerComponent(
      'com.example.blockTypeButton',
      ({ builder, engine: eng, cesdk: cesdkInstance }) => {
        // Engine API calls are tracked. When the selection changes,
        // the component re-renders automatically.
        const selectedBlocks = eng.block.findAllSelected();
        const selectedBlock =
          selectedBlocks.length > 0 ? selectedBlocks[0] : null;
        const blockType = selectedBlock
          ? eng.block.getType(selectedBlock)
          : null;
        const label = blockType ? formatBlockType(blockType) : 'No Selection';

        builder.Button('block-type-display', {
          label,
          icon: '@imgly/icons/Info',
          isDisabled: !selectedBlock,
          onClick: () => {
            const message = selectedBlock
              ? `Selected block type: ${blockType}`
              : 'No block selected';
            cesdkInstance.ui.showNotification({ message, type: 'info' });
          }
        });
      }
    );

    // Register a component with a dropdown menu containing buttons.
    // Dropdowns in the navigation bar support Button and Separator elements.
    cesdk.ui.registerComponent(
      'com.example.actionsDropdown',
      ({ builder, engine: eng, cesdk: cesdkInstance }) => {
        const selectedBlocks = eng.block.findAllSelected();
        const selectedBlock =
          selectedBlocks.length > 0 ? selectedBlocks[0] : null;

        builder.Dropdown('actions-dropdown', {
          label: 'Actions',
          icon: '@imgly/icons/Adjustments',
          children: () => {
            builder.Button('action-duplicate', {
              label: 'Duplicate',
              icon: '@imgly/icons/Duplicate',
              variant: 'plain',
              isDisabled: !selectedBlock,
              onClick: () => {
                if (selectedBlock) {
                  eng.block.duplicate(selectedBlock);
                  cesdkInstance.ui.showNotification({
                    message: 'Block duplicated',
                    type: 'info'
                  });
                }
              }
            });

            builder.Button('action-delete', {
              label: 'Delete',
              icon: '@imgly/icons/Trash',
              variant: 'plain',
              color: 'danger',
              isDisabled: !selectedBlock,
              onClick: () => {
                if (selectedBlock) {
                  eng.block.destroy(selectedBlock);
                  cesdkInstance.ui.showNotification({
                    message: 'Block deleted',
                    type: 'info'
                  });
                }
              }
            });

            builder.Separator('action-separator');

            builder.Button('action-select-all', {
              label: 'Select All',
              icon: '@imgly/icons/SelectAll',
              variant: 'plain',
              onClick: () => {
                const page = eng.scene.getCurrentPage();
                if (page) {
                  const children = eng.block.getChildren(page);
                  children.forEach((child) =>
                    eng.block.setSelected(child, true)
                  );
                }
              }
            });
          }
        });
      }
    );

    // Place the custom components in the navigation bar.
    // Use setComponentOrder to define the order of components.
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.save',
      'com.example.blockTypeButton',
      'com.example.actionsDropdown',
      'ly.img.spacer',
      'ly.img.undo',
      'ly.img.redo',
      'ly.img.zoom.navigationBar'
    ]);
  }
};

// Helper function to format block type for display
function formatBlockType(blockType: string): string {
  // Extract the last part of the block type (e.g., '//ly.img.ubq/graphic' -> 'Graphic')
  const parts = blockType.split('/');
  const typeName = parts[parts.length - 1];
  return typeName.charAt(0).toUpperCase() + typeName.slice(1);
}

export default registerNewComponentPlugin;
