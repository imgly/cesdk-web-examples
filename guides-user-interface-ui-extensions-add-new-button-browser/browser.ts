import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-user-interface-ui-extensions-add-new-button-browser';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    // Setup the page with a gradient background and centered text
    const page = engine.block.findByType('page')[0];
    if (page) {
      // Add gradient background
      const gradientFill = engine.block.createFill('gradient/linear');
      engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
        { color: { r: 0.15, g: 0.1, b: 0.35, a: 1.0 }, stop: 0 },
        { color: { r: 0.4, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
        { color: { r: 0.6, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
      ]);
      engine.block.setFill(page, gradientFill);

      // Add centered text elements
      const pageWidth = engine.block.getWidth(page);
      const pageHeight = engine.block.getHeight(page);

      // Create title text "Create custom buttons"
      const titleText = engine.block.create('text');
      engine.block.replaceText(titleText, 'Create custom buttons');
      engine.block.setFloat(titleText, 'text/fontSize', 20);
      engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
      engine.block.setWidthMode(titleText, 'Auto');
      engine.block.setHeightMode(titleText, 'Auto');
      engine.block.appendChild(page, titleText);

      // Create "IMG.LY" text
      const imglyText = engine.block.create('text');
      engine.block.replaceText(imglyText, 'IMG.LY');
      engine.block.setFloat(imglyText, 'text/fontSize', 14);
      engine.block.setTextColor(imglyText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
      engine.block.setWidthMode(imglyText, 'Auto');
      engine.block.setHeightMode(imglyText, 'Auto');
      engine.block.appendChild(page, imglyText);

      // Get dimensions and center both texts
      const titleWidth = engine.block.getFrameWidth(titleText);
      const titleHeight = engine.block.getFrameHeight(titleText);
      const imglyWidth = engine.block.getFrameWidth(imglyText);
      const imglyHeight = engine.block.getFrameHeight(imglyText);

      const spacing = 8;
      const totalHeight = titleHeight + spacing + imglyHeight;
      const startY = (pageHeight - totalHeight) / 2;

      // Position title text
      engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
      engine.block.setPositionY(titleText, startY);

      // Position IMG.LY text below title
      engine.block.setPositionX(imglyText, (pageWidth - imglyWidth) / 2);
      engine.block.setPositionY(imglyText, startY + titleHeight + spacing);
    }

    cesdk.ui.registerComponent('theme.toggle', ({ builder }) => {
      const isDark = cesdk.ui.getTheme() === 'dark';

      builder.Button('toggle-theme', {
        label: 'Dark Mode',
        icon: isDark ? '@imgly/ToggleIconOn' : '@imgly/ToggleIconOff',
        variant: 'regular',
        isActive: isDark,
        onClick: () => {
          cesdk.ui.setTheme(isDark ? 'light' : 'dark');
        }
      });
    });

    cesdk.ui.registerComponent('favorite.toggle', ({ builder, state }) => {
      const { value: isFavorite, setValue: setIsFavorite } = state(
        'isFavorite',
        false
      );

      builder.Button('toggle-favorite', {
        label: 'Favorite',
        icon: '@imgly/ShapeStar',
        variant: 'regular',
        isActive: isFavorite,
        onClick: () => {
          setIsFavorite(!isFavorite);
        }
      });
    });

    cesdk.ui.registerComponent('quick.export', ({ builder }) => {
      builder.Button('quick-export', {
        label: 'Export',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: () => {
          cesdk.actions.run('exportDesign');
        }
      });
    });

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'favorite.toggle');
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'quick.export');

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, 'theme.toggle');
  }
}

export default Example;
