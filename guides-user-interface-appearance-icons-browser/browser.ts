import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-user-interface-appearance-icons-browser';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Set the editor view
    cesdk.ui.setView('advanced');

    // Create a design scene
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // Register a custom SVG icon set with multiple symbols
    cesdk.ui.addIconSet(
      '@custom/icons',
      `
      <svg xmlns="http://www.w3.org/2000/svg">
        <symbol id="@custom/icon/star" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        </symbol>
        <symbol id="@custom/icon/heart" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.12831 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" fill="currentColor"/>
        </symbol>
        <symbol id="@custom/icon/diamond" viewBox="0 0 24 24" fill="none">
          <path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill="currentColor"/>
        </symbol>
      </svg>
    `
    );

    // Get the current dock order and replace the Images dock icon
    const dockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.dock' },
      dockOrder.map((entry) => {
        if (entry.key === 'ly.img.image') {
          return { ...entry, icon: '@custom/icon/star' };
        }
        return entry;
      })
    );

    // Register a custom component that uses a custom icon
    cesdk.ui.registerComponent(
      'CustomIconButton',
      ({ builder: { Button } }) => {
        Button('heartButton', {
          label: 'Heart',
          icon: '@custom/icon/heart',
          onClick: () => {
            console.log('Heart icon button clicked');
          }
        });
        Button('diamondButton', {
          label: 'Diamond',
          icon: '@custom/icon/diamond',
          onClick: () => {
            console.log('Diamond icon button clicked');
          }
        });
      }
    );

    // Add the custom component to the canvas menu
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' }),
      'CustomIconButton'
    ]);

    // Add an image block to the scene so the canvas menu is visible when selected
    const page = engine.block.findByType('page')[0];
    if (page !== undefined) {
      const imageBlock = await engine.block.addImage(
        'https://img.ly/static/ubq_samples/sample_1.jpg',
        {
          x: 50,
          y: 50,
          size: { width: 400, height: 300 }
        }
      );
      engine.block.appendChild(page, imageBlock);
      engine.block.select(imageBlock);
    }
  }
}

export default Example;
